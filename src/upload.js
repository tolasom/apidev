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

/** filepath is where the file directory ready to be uploaded */
const filepath = '../audios/'
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

app.listen(port,host,()=>{
    console.log(`REST minio api is running on port http://${host}:${port}`)
})
