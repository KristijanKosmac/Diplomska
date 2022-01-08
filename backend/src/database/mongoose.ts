const mongoose = require('mongoose');

const connectionURL = `${process.env.MONGODB_URL}/${process.env.TABLE_NAME}-api`

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
