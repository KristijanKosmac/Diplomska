
const {
    PORT,
    MONGODB_URL,
    TABLE_NAME,
    EMAIL_USERNAME,
    EMAIL_PASSWORD
} = process.env;

if (
    !PORT ||
    !MONGODB_URL ||
    !TABLE_NAME ||
    !EMAIL_USERNAME ||
    !EMAIL_PASSWORD
) {
    throw new Error("Missing configuration parameters");
}

export = {
    PORT,
    MONGODB_URL,
    TABLE_NAME,
    EMAIL_USERNAME,
    EMAIL_PASSWORD
};
