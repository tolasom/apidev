const Express = require('express')
const app = Express()
const Minio = require('minio')
const BodyParser = require('body-parser')
const fs = require('fs')
const Promise = require('bluebird')
const port = 8082, host = '127.0.0.1'

const mongoose = require('mongoose')
const config = require('./config/database.config')
const FilePath = require('./models/filepath.mod')

mongoose.Promise = global.Promise
/**connect to mongo database if it fail to attemp */
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
/**connect ot mongo database */
const mongoConnection = mongoose.connection
mongoConnection.on('connected',()=>{
    console.log('success connected to mongoose')
})
mongoConnection.on('reconnected',()=>{
    console.log('reconnected')
})
app.use(BodyParser.urlencoded({ extended: true}))
app.use(BodyParser.json())

// comment here to test CRUD
const minioClient = new Minio.Client({
    endPoint: 'play.minio.io',
    port: 9000,
    useSSL: true,
    accessKey: 'Q3AM3UQ867SPQQA43P2F',
    secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
});

/** filepath is where the file directory ready to be uploaded */
const filepath = './audios/'
const metaData = { 
    'Content-Type' : 'application/octet-stream' 
    // 'Content-Length' : '1414' 
}
//upload script (work)
fs.readdir(filepath, (err, files)=>{
    if (err) {return err}
    files.forEach((file)=>{
        minioClient.fPutObject('khbucket', file, filepath.concat(file), metaData, (err,stream)=>{
            if(err) { return console.log(err)}
            console.log('done : '+ file)
        })
    })
})

// information script (work)
// const listObj = minioClient.listObjects('khbucket','',true)
// listObj.on('data',(obj)=>{
//     console.log(obj)
// })
// listObj.on('error',(e)=>{
//     console.log(e)
// })

// slice object name 

const listObj = minioClient.listObjects('tolabucket','',true)
listObj.on('data',(obj)=>{
    var namestr = obj.name 
    var sizeSave = obj.size
    var lastM = obj.lastModified 
    var arrayStr = namestr.replace(".wav","")
    console.log(arrayStr)
    var spl = arrayStr.split("_")
    console.log(spl)
    var datestr = spl[0]
    var Desti = spl[1]
    var Host = spl[2]
    console.log('Name :\t'+ namestr + '\n lastModified\t' + lastM + '\n Size:\t' + sizeSave +'\n'+'Date :\t'+ datestr+'\n Destination:\t'+Desti+'\n Host:\t'+Host)
    if(spl){
        FilePath.create({
            name : namestr,
            timeStamp : datestr,
            destinationNumber : Desti,
            hostNumber : Host,
            lastModified : lastM,
            size : sizeSave
        })
        .then((data)=>{
            console.log('success', data)
            FilePath.get(namestr,
                datestr,
                Host,
                Desti,
                lastM,
                sizeSave
            ).then((doc)=>{
                console.log(doc)
            })
            .catch(err=>{
                console.log('error',err)
            })
        })
        .catch(err=>{
            console.log(err)
        })
     }
})
listObj.on('error',(e)=>{
    console.log(e)
})


app.get('/',(req,res)=>{
    console.log('welcome to the application')
    res.json({
        message: 'Welcome to the application'
    })
})

// const readApi = require('./routes/file.route')
// app.get('/files',readApi)

require('./routes/file.route')(app)

// app.route('./routes/file.route')
//     .get('/files',(req,res)=>{
//         console.log('success')
//     })

// const func = require('./routes/file.route')
// func(app)
// app.get('/files',(req,res)=>{
//     res.send({
//         message: 'success',
//         data: data
//     })
// })

// app.get('/files/:fileId',(req,res)=>{
//     res.send({
//         message: 'success',
//         data: data
//     })
// })



app.listen(port,host,()=>{
    console.log(`REST minio api is running on port http://${host}:${port}`)
})
