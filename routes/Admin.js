const express = require('express');

let Admin = require('../controllers/Admin');
let adminRouter = express.Router();

adminRouter.post('/create', Admin.create);
adminRouter.post('/read', Admin.read);
adminRouter.post('/update', Admin.update);
adminRouter.post('/delete', Admin.delete_);

module.exports = adminRouter;