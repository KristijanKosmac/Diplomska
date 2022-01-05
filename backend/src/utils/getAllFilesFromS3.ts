import config from "../config";
import { s3 } from "../s3"

export const getAllFilesFromS3 = async (location: string) => {
    const data = await s3.listObjectsV2({
      Bucket: config.s3BucketName,
      Prefix: location
    }).promise()

    return data.Contents;
  }