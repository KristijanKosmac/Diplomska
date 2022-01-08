
const {
    PORT,
    MONGODB_URL,
    TABLE_NAME,
} = process.env;

if (
    !PORT ||
    !MONGODB_URL ||
    !TABLE_NAME
) {
    throw new Error("Missing configuration parameters");
}

export =  {
    PORT,
    MONGODB_URL,
    TABLE_NAME
};
