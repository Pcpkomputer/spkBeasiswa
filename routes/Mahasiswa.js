const express = require('express');

let Mahasiswa = require('../controllers/Mahasiswa');
let mahasiswaRouter = express.Router();

mahasiswaRouter.post('/create', Mahasiswa.create);
mahasiswaRouter.post('/read', Mahasiswa.read);
mahasiswaRouter.post('/update', Mahasiswa.update);
mahasiswaRouter.post('/delete', Mahasiswa.delete_);


module.exports = mahasiswaRouter;