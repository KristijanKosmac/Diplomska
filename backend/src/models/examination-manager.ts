import { ExaminationTable, ExaminationEntity } from "../database/entities";
import { DoneResult, MulterFiles } from "../types";
import { codedError } from "../lib/coded-error";
import HTTP from "http-status-codes";
import { Document } from "../types/index"
import config from "../config";
import { getAllFilesFromS3 } from "../utils/getAllFilesFromS3";
import { s3 } from "../s3";
import * as nodemailer from "nodemailer";
import * as AWS from "aws-sdk";
import { v4 as uuid} from "uuid";

export class ExaminationManager {

  /**
   *
   *
   * @param {Examination} data
   * @return {*}  {(Promise<DoneResult & { id: string }>)}
   * @memberof ExaminationManager
   */
  async addExamination(data: ExaminationEntity): Promise<DoneResult & { id: string }> {
    data.id = uuid();
    const response: ExaminationEntity = await ExaminationTable.create(data);

    return { done: true, id: response.id };
  }

  /**
   *
   *
   * @param {Examination} updatedData
   * @return {*}  {Promise<DoneResult>}
   * @memberof ExaminationManager
   */
  async updateExaminationDetails(id: string, updatedData: Partial<ExaminationEntity>): Promise<DoneResult> {
    try {
      await ExaminationTable.update(updatedData, {
        where: {
          id
        }
      });
    } catch (e) {
      throw codedError(HTTP.INTERNAL_SERVER_ERROR, "There was a problem updating examination details")
    }

    return { done: true };
  }

  /**
   *
   *
   * @param {string} id
   * @return {*}  {Promise<DoneResult>}
   * @memberof ExaminationManager
   */
  async deleteExamination(id: string): Promise<DoneResult> {
    try {
      await this.getExamination(id);
    } catch (e) {
      throw codedError(HTTP.BAD_REQUEST, "Can't be deleted examination that doesn't exists!")
    }

    await ExaminationTable.destroy({
      where: {
        id
      }
    });

    return { done: true };


  }

  /**
   *
   *
   * @param {string} id
   * @return {*}  {Promise<any>}
   * @memberof ExaminationManager
   */
  async getExamination(id: string): Promise<ExaminationEntity> {
    const examination = await ExaminationTable.findOne({
      where: {
        id
      },
      raw: true
    });

    if (!examination) {
      throw codedError(HTTP.NOT_FOUND, `Examination does not exist in the system!`);
    }
    return examination;
  }
  /**
   *
   *
   * @param {string} patientId
   * @return {*}  {Promise<ExaminationEntity[]>}
   * @memberof ExaminationManager
   */
  async getAllPatientExaminations(patientId: string): Promise<ExaminationEntity[]> {
    const examinations = await ExaminationTable.findAll({
      where: { patientId },
      include: ["patient"]
    })

    if (!examinations) {
      throw codedError(HTTP.NO_CONTENT, "There are no examinations")
    }
    return examinations;
  }

  /**
   *
   *
   * @return {*}  {Promise<ExaminationEntity[]>}
   * @memberof ExaminationManager
   */
  async getAllExaminations(): Promise<ExaminationEntity[]> {
    const examinations = await ExaminationTable.findAll({ include: ["patient"] });

    if (!examinations) {
      throw codedError(HTTP.NO_CONTENT, "There are no examinations")
    }
    return examinations;
  }
  /**
   *
   *
   * @param {MulterFiles} { files }
   * @return {*}  {(Promise<DoneResult & { successMessage: string }>)}
   * @memberof ExaminationManager
   */
  async uploadFiles({ files }: MulterFiles): Promise<DoneResult & { successMessage: string }> {
    if (!files || files!.length === 0) {
      throw codedError(HTTP.NO_CONTENT, "There are no files")
    }
    return { done: true, successMessage: `Successfully uploaded ${files!.length} files` };
  }
  /**
   *
   *
   * @param {string} patientId
   * @param {string} examinationId
   * @return {*}  {Promise<Document[]>}
   * @memberof ExaminationManager
   */
  async getAllDocuments(patientId: string, examinationId: string): Promise<Document[]> {
    const data = await getAllFilesFromS3(`${patientId}/${examinationId}`)

    if (!data) {
      throw codedError(HTTP.NOT_FOUND, `There are no documents!`);
    }

    const documents = data.map((document) => {
      const { Key } = document

      const url = s3.getSignedUrl('getObject', {
        Bucket: config.s3BucketName,
        Key,
        Expires: 300
      })

      return {
        ...document,
        url: url
      }
    })

    return documents;
  }
  /**
   *
   *
   * @param {string} Key
   * @return {*}  {Promise<DoneResult>}
   * @memberof ExaminationManager
   */
  async deleteDocument(Key: string): Promise<DoneResult> {
    try {
      await s3.deleteObject({
        Bucket: config.s3BucketName,
        Key
      }).promise();
    } catch (error) {
      throw codedError(HTTP.INTERNAL_SERVER_ERROR, "Problem while deleting document");
    }

    return { done: true }
  }

  async downloadDocument(Key: string) {
    const url = s3.getSignedUrl('getObject', {
      Bucket: config.s3BucketName,
      Key,
      Expires: 300
    })

    return url
  }

  async sendEmail(emails: string[], documentId: string): Promise<DoneResult> {
    // const examination = await this.getExamination(examinationId);
    const s3 = new AWS.S3();

    // const key = `${examination.patientId}/${examinationId}`;
    //TODO: SEND ONLY DOCUMENT PET/CT report (pdf format)
    // let files: AWS.S3.GetObjectOutput[] = [];

    // const listings = await s3.listObjectsV2({
    //   Bucket: config.s3BucketName,
    //   Prefix: key
    // }).promise()
    
    // if (listings && listings.Contents && listings.Contents.length > 0) {
    //   files = await Promise.all(listings!.Contents.map(async listing => {
    //     return s3.getObject({
    //       Bucket: config.s3BucketName,
    //       Key: listing.Key!
    //     }).promise();
    //   })
    //   );
    // }

    const file = await s3.getObject({
      Bucket: config.s3BucketName,
      Key: documentId
    }).promise()

    var ses = new AWS.SES({
      region: "eu-west-1"
    });

    var mailOptions = {
      from: config.fromEmail,
      subject: 'Testing email sender functions!',
      html: `<p>Your medical examination summary: <b></b></p>`,
      to: emails,
      // bcc: Any BCC address you want here in an array,
      attachments: [{
          filename: documentId.split("-")[documentId.split("-").length - 1],
          content: file.Body as Buffer
        }]
    }

    var transporter = nodemailer.createTransport({
      SES: ses
    });

    try {
      await transporter.sendMail(mailOptions);
    } catch (e) {
      console.log("Error while sending email ->", e);
    }

    return { done: true };
  }

}
