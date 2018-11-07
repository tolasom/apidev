module.exports = (app) => {
    
    const files = require('../controllers/filepath.controller');

    // Retrieve all files
    app.get('/files', files.findAll);

    // Retrieve single file based on _id
    app.get('/files/:fileId', files.findOne)

}