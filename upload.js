const Express = require('express')
const app = Express()
const Minio = require('minio')
const BodyParser = require('body-parser')
const fs = require('fs')
const port = 8082, host = '127.0.0.1'
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
// const minioClient = new Minio.Client({
//     endPoint : '192.168.7.135',
//     port: 9180,
//     useSSL: true ,
//     accessKey : '4C36BIHPD5ADJ0D6L659',
//     secretKey : 'fjbJ2ZytbwayovUovClm3U19IBXvCC7yGaKRMijH' 
// })

/** filepath is where the file directory ready to be uploaded */
const filepath = './audios/'
const metaData = { 
    'Content-Type' : 'application/octet-stream',
    'Content-Length' : '1414' 
}

//upload script (work)
fs.readdir(filepath, (err, files)=>{
    if (err) return err
    files.forEach((file)=>{
        minioClient.fPutObject('tolabucket', file, filepath.concat(file), metaData, (err,stream)=>{
            if(err) { return console.log(err)}
            console.log('done : '+ file)
        })
    })
})

// list files
 const listObj = minioClient.listObjects('tolabucket','',true)
listObj.on('data',(obj)=>{
    console.log(obj)
})
listObj.on('error',(e)=>{
    console.log(e)
})

app.listen(port,host,()=>{
    console.log(`REST minio api is running on port http://${host}:${port}`)
})
