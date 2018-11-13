module.exports = (app) => {
    
    const files = require('../controllers/filepath.controller');

<<<<<<< HEAD
    // Retrieve all files
    app.get('/files', files.findAll);

    // Retrieve single file based on _id
=======
    // Retrieve all fiiles
    app.get('/files', files.findAll);
    // Retrieve file
>>>>>>> 0ef97a53cfc4ae383dad8223ad4e921dd9a4f8ec
    app.get('/files/:fileId', files.findOne)

}