const express = require('express');

let Pendaftaran = require('../controllers/Pendaftaran');
let pendaftaranRouter = express.Router();

pendaftaranRouter.post('/create', Pendaftaran.create);
pendaftaranRouter.post('/read', Pendaftaran.read);
pendaftaranRouter.post('/update', Pendaftaran.update);
pendaftaranRouter.post('/delete', Pendaftaran.delete_);



module.exports = pendaftaranRouter;