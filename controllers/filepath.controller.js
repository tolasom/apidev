const filepath = require('../models/filepath.mod')

exports.findAll = (req,res)=>{
    filepath.find()
    .then(notes => {
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
}


exports.findOne = (req, res) => {
    filepath.findById(req.params.fileId)
    .then(file => {
        if(!file) {
            return res.status(404).send({
                message: "filepath not found with id " + req.params.fileId
            });            
        }
        res.send(file);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "filepath not found with id " + req.params.fileId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving file with id " + req.params.fileId
        });
    });
};