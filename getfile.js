const Express = require('express')
const app = Express()
const Minio = require('minio')
const fs = require('fs')
const mongoose = require('mongoose')
const port = 8082, host = '127.0.0.1'
const Promise = require('bluebird')
const config = require('./config/database.config')
const FilePath = require('./models/filepath.mod')

const minioClient = new Minio.Client({
    endPoint: 'play.minio.io',
    port: 9000,
    useSSL: true,
    accessKey: 'Q3AM3UQ867SPQQA43P2F',
    secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'    
})

const filepath = './audios/'
const metaData = { 
    'Content-Type' : 'application/octet-stream'
}

mongoose.Promise = global.Promise
const connectMongoDBWithInitialFailedRetry =()=>{
    mongoose.connect(config.mongo.database, {
        useNewUrlParser: true
    }).then(() => {
        console.log("Successfully connected to the database");    
    }).catch(err => {
        console.log('Could not connect to the database. Exiting now...' + err);
        process.exit();
        Option(connect,config.mongo.options)
        setTimeout(connect,config.mongo.initialRetryTime)
    })
}
connectMongoDBWithInitialFailedRetry()
const mongoConnection = mongoose.connection
mongoConnection.on('connected',()=>{
    console.log('Success connected to mongoose')
})
mongoConnection.on('reconnected',()=>{
    console.log('reconnected to the mongoose')
})



app.listen(port,host,()=>{
    console.log(`http://${host}:${port}`)
})