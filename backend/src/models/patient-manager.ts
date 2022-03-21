import HTTP from "http-status-codes";
import nodemailer from "nodemailer"
import fs from "fs"
import JSZip from "jszip"
import { DoneResult, File } from "../types";
import { Patient, PatientInteface } from "../database/entities";
import { codedError } from "../lib/coded-error";
import rimraf from "rimraf"
import { userManager } from "./user-manager";
import { doctorManager } from "./doctor-manager"
const { EMAIL_PASSWORD, EMAIL_USERNAME } = require("../config")
class PatientManager {

    async addPatient(data: PatientInteface): Promise<DoneResult & { id: string }> {
        try {
            const res = await userManager.createUser(data.email)

            const patient = new Patient({id: res.id, ...data});
            await patient.save()
            await doctorManager.addDoctor({...data, id: res.id, role: "Patient"})

            // TODO CHECK IF patient.id work if it doenst change it with patient._id
            return { done: true, id: patient.id };
        } catch (e) {
            throw e
        }
    }

    async updatePatient(id: string, updatedData: PatientInteface): Promise<DoneResult> {
        try {
            await Patient.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true })
        } catch (e) {
            throw e
        }

        return { done: true };
    }

    async deletePatient(id: string): Promise<DoneResult> {
        try {
            await Patient.findByIdAndRemove(id)
            await this.deleteFolder(id, "")
        } catch (e) {
            throw codedError(HTTP.BAD_REQUEST, "Can't be deleted patient that doesn't exists!")
        }

        return { done: true };
    }

    async getPatient(id: string): Promise<PatientInteface> {
        // const patient = await Patient.findById(id)
        const patient = await Patient.findOne({id})

        if (!patient || !id) {
            throw codedError(HTTP.NOT_FOUND, `Patient does not exist`);
        }

        return patient;
    }

    async getAllPatientsForDoctor(doctorId: string): Promise<PatientInteface[]> {
        const patients = await Patient.find({ familyDoctor: doctorId })
        if (!patients) {
            throw codedError(HTTP.NO_CONTENT, "There are no patients in the system")
        }
        return patients;
    }

    async uploadFiles(files: any): Promise<DoneResult> {
        if (!files || files!.length === 0) {
            throw codedError(HTTP.NO_CONTENT, "There are no files")
        }
        return { done: true };
    }

    async createFolder(patientId: string, folderName: string): Promise<DoneResult> {
        const path = `src/documents/${patientId}/${folderName}`

        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true })
        } else {
            throw codedError(HTTP.CONFLICT, `Folder with ${folderName} name already exists`)
        }

        return { done: true };
    }

    async renameFolder(patientId: string, folderName: string, newFolderName: string): Promise<DoneResult> {
        const oldPath = `src/documents/${patientId}/${folderName}`
        const newPath = `src/documents/${patientId}/${newFolderName}`

        if (!fs.existsSync(newPath)) {
            fs.renameSync(oldPath, newPath)
        } else {
            throw codedError(HTTP.CONFLICT, `Folder with ${folderName} name already exists`)
        }
      
        return { done: true };
    }

    async deleteFolder(patientId: string, folderName: string): Promise<DoneResult> {
        const path = `src/documents/${patientId}/${folderName}`

        rimraf(path, (err) => {
            console.log(err)
        })
        return { done: true };
    }

    async getAllFolders(patientId: string): Promise<string[]> {
        const path = `src/documents/${patientId}/`
        const folders = fs.readdirSync(path)

        if (folders.length === 0) {
            throw codedError(HTTP.NOT_FOUND, `There are no folders`)
        }
        return folders
    }

    async deleteFile(patientId: string, fileName: string): Promise<DoneResult> {
        const path = `src/documents/${patientId}/${fileName}`

        fs.unlink(path, (err) => {
            if (err) throw err

            console.log("File deleted")
        })

        return { done: true };
    }

    async getAllFiles(patientId: string, encoding = "base64"): Promise<File[]> {
        const path = `src/documents/${patientId}/`
        const filenames = fs.readdirSync(path)
        const files: File[] = filenames.map(function (filename) {
            const content = fs.readFileSync(path + filename, { encoding })

            return { filename, content }
        });

        return files
    }

    async getAllFilesFromFolder(patientId: string, folderName: string, encoding = "base64"): Promise<File[]> {
        const path = `src/documents/${patientId}/${folderName}/`
        const filenames = fs.readdirSync(path)
        const files: File[] = filenames.map(function (filename) {
            const content = fs.readFileSync(path + filename, { encoding })

            return { filename, content }
        });

        return files
    }

    async getMultipleFiles(patientId: string, documentIds: string[],folderName: string, encoding = "base64"): Promise<Buffer | string> {
        const path = `src/documents/${patientId}/${folderName}/`
        const zip = new JSZip()

        documentIds.forEach(documentId => {
            zip.file(documentId.split("-").slice(1).join("-"), fs.readFileSync(path + documentId, "base64"), { base64: true });
        })
        const zipFile = await zip.generateAsync({ type: "base64" });

        return zipFile
    }

    async getFile(patientId: string, documentId: string, encoding = "base64"): Promise<File> {
        const path = `src/documents/${patientId}/`
        const content = fs.readFileSync(path + documentId, { encoding })

        return { content, filename: documentId }
    }

    async sendEmail(patientId: string, emails: string[], text: string, fileIds: string[]): Promise<DoneResult> {
        let transporter = nodemailer.createTransport({
            service: "Outlook365",
            auth: {
                user: EMAIL_USERNAME, // generated ethereal user
                pass: EMAIL_PASSWORD, // generated ethereal password
            },
        });

        let attachments: File[] = [];
        if (fileIds.length > 1) {
            const files = await this.getAllFiles(patientId, '')
            attachments = files.filter(file => fileIds.includes(file.filename))
        } else {
            const { content } = await this.getFile(patientId, fileIds[0], "")
            attachments = [{ filename: fileIds[0], content }]
        }

        // send mail with defined transport object
        await transporter.sendMail({
            from: EMAIL_USERNAME,
            to: emails,
            subject: "Files from your medical folder",
            text,
            attachments
            //html: "<b>Hello world?</b>", // html body
        });

        return { done: true };
    }

}

export const patientManager = new PatientManager()