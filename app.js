const Express = require('express')
const app = Express()
const Minio = require('minio')
const BodyParser = require('body-parser')
const fs = require('fs')
const Promise = require('bluebird')
const port = 8080
const host = '127.0.0.1'

const mongoose = require('mongoose')
const config = require('./config/config')
const FilePath = require('./model/FilePath')

//connect to mongo
mongoose.Promise = global.Promise
const connectMongoDBWithInitialFailedRetry = ()=>{
    mongoose.connect(config.mongo.database, config.mongo.options)
    .then(()=>{
        console.log('success initial connection to db')
    }).catch(error=>{
        console.log('error connecting to DB' + error)
        mongoose.disconnect()
        setTimeout(connect,config.mongo.initialRetryTime)
    })
}
connectMongoDBWithInitialFailedRetry()
const mongoConnection = mongoose.connection

/**useNewUrlParser: true */

mongoConnection.on('connected',()=>{
    console.log('successs connected to mongoose')
})
mongoConnection.on('reconnected',()=>{
    console.log('reconnected')
})

app.use(BodyParser.urlencoded({ extended: true}))
app.use(BodyParser.json())

const minioClient = new Minio.Client({
    endPoint: 'play.minio.io',
    port: 9000,
    useSSL: true,
    accessKey: 'Q3AM3UQ867SPQQA43P2F',
    secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'

});

/** filepath is where the file directory ready to be uploaded */
const filepath = '/home/tolasom/Desktop/apidev/audios/'
const metaData = { 
    'Content-Type' : 'application/octet-stream', 
    'Content-Length' : '1414' 
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
const listObj = minioClient.listObjects('khbucket','',true)
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
    console.log('Name :\t'+namestr+'\n lastModified\t'+lastM+'\n Size:\t'+sizeSave+'\n'+'Date :\t'+datestr+'\n Destination:\t'+Desti+'\n Host:\t'+Host)
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






app.listen(port,host,()=>{
    console.log(`REST minio api is running on port http://${host}:${port}`)
})
