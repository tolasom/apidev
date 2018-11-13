const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Promise = require('bluebird')
const FilePath = new Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    CreationDate : {
        type: String,
        required: [true, 'timeStamp is required']
    },
    Caller : {
        type: Number,
        required: [true, 'caller number is required ']
    },
    Callee : {
        type: Number,
        required: [true, 'callee number is required ']

    },
    lastModified : {
        type: String,
        required: [true, 'lastModified is required']
    }
    ,
    size: {
        type: Number,
        required: [true, 'size is required ']
    }
})


FilePath.statics.create = (obj)=>{
    return new Promise((resolve,reject)=>{
        console.log('Store file object', obj)
        const filePath = new Self({
            name: obj.name,
            CreationDate : obj.CreationDate,
            Caller: obj.Caller,
            Callee: obj.Callee,
            lastModified: obj.lastModified,
            size: obj.size
        })
        filePath.save((err,fp)=>{
            if(err){return reject(err)}
            return resolve(fp)
        })
    })
}

FilePath.statics.get = (name ,CreationDate,Caller,Callee,lastModified,size)=>{
    return new Promise((resolve,reject)=>{
        console.log('Get file object : '+'{\n'+'\n Name:\t'+ name+',\n CreationDate:\t'+ CreationDate +',\n Caller:\t'+ Caller+',\n Callee:\t'+ Callee+',\n Last Modified:\t'+ lastModified+ 'Size :'+size)
        if(CreationDate){ 
            Self.find({
                name: name,
                CreationDate: CreationDate,
                Caller: Caller,
                Callee: Callee,
                lastModified: lastModified,
                size: size
            }, (err,data)=>{
                if(err){return reject(err)}
                return resolve(data)
            })
        }
        else{
            Self.find({
                name: name,
                CreationDate: CreationDate,
                Caller: Caller,
                Callee: Callee,
                lastModified: lastModified
                // size: size
            }, (err,data)=>{
                if(err){return reject(err)}
                return resolve(data)
            })
        }
    })
}

const Self = module.exports = mongoose.model('FilePath', FilePath)