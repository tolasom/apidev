module.exports = (app) => {
    const files = require('../controllers/filepath.controller');

    // Retrieve all fiiles
    app.get('/files', files.findAll);
    // Retrieve file
    app.get('/files/:fileId', files.findOne)

}