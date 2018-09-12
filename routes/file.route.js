module.exports = (app) => {
    const files = require('../controllers/filepath.controller');


    // Retrieve all Notes
    app.get('/files', files.findAll);

    app.get('/files/:fileId', files.findOne)

}