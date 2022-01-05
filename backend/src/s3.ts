import AWS from "aws-sdk";

export const s3 = new AWS.S3({
    credentials: {
      accessKeyId: "AKIATBVLFFVRYLSI2UYC",
      secretAccessKey: "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",
    },
    region: "eu-central-1",
  })