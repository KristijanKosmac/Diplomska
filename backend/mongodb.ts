import { MongoClient } from 'mongodb'

const connectionURL = process.env.MONGODB_URL
const databaseName = process.env.TABLE_NAME

console.log(connectionURL)
console.log(databaseName)
MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }

    client.db(databaseName)
})
