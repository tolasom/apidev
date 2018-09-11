const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Promise = require('bluebird')
const FilePath = new Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    date : {
        type: String,
        required: [true, 'date is required']
    },
    hostNumber : {
        type: Number,
        required: [true, 'hose number is required ']
    },
    destinationNumber : {
        type: Number,
        required: [true, 'destination number is required ']

    },
    lastModified : {
        type: String,
        required: [true, 'lastModified is required']
    },
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
            date : obj.date,
            hostNumber: obj.hostNumber,
            destinationNumber: obj.destinationNumber,
            lastModified: obj.lastModified,
            size: obj.size
        })
        filePath.save((err,fp)=>{
            if(err){return reject(err)}
            return resolve(fp)
        })
    })
}

FilePath.statics.get = (name,date,hostNumber,destinationNumber,lastModified,size)=>{
    return new Promise((resolve,reject)=>{
        console.log('Get file object : '+'{\n'+'\n Name:\t'+ name+',\n Date:\t'+ date +',\n Host Number:\t'+ hostNumber+',\n Destination Number:\t'+ destinationNumber+',\n Last Modified:\t'+ lastModified+',\n Size:\t'+ size +'\n}')
        if(date){ 
            Self.find({
                name: name,
                date: date,
                hostNumber: hostNumber,
                destinationNumber: destinationNumber,
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
                date: date,
                hostNumber: hostNumber,
                destinationNumber: destinationNumber,
                lastModified: lastModified,
                size: size
            }, (err,data)=>{
                if(err){return reject(err)}
                return resolve(data)
            })
        }
    })
}
const Self = module.exports = mongoose.model('FilePath', FilePath)