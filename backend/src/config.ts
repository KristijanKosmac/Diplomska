
const {
    databaseHost,
    databasePort,
    databaseName,
    databaseUsername,
    s3BucketName,
    fromEmail,
} = process.env;

// This should speed up the sdk requests by not closing the TCP connection immediatelly for
// AWS requests after an sdk request(creating a new TCP connection might take longer than a dynamodb request)
process.env.AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1";

if (
    !databaseHost ||
    !databasePort ||
    !databaseName ||
    !databaseUsername ||
    !s3BucketName ||
    !fromEmail
) {
    throw new Error("Missing configuration parameters");
}

export =  {
    database: {
        host: databaseHost,
        port: parseInt(databasePort),
        username: databaseUsername,
        name: databaseName,
        
    },
    s3BucketName,
    fromEmail
};
