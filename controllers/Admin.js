let Admin = require('../models/Admin');

let create = function (req, res, next) {
    let { email, nama, password } = req.body;
    let entitasAdmin = new Admin({ email, nama, password });
    entitasAdmin.create()
        .then(() => {
            res.redirect('/admin?msg=Data berhasil dimasukkan.&type=success')
        }).catch((err) => {
            res.status(404).send(err);
        })
}

let read = function (req, res, next) {
    let entitasAdmin = new Admin({});
    entitasAdmin.read()
        .then((values) => {
            res.send(values);
        })
        .catch((err) => {
            res.status(404).send(err);
        })
}

let delete_ = function (req, res, next) {
    let { idadmin, email, nama, password } = req.body;
    let entitasAdmin = new Admin({ idadmin, email, nama, password });
    entitasAdmin.delete()
        .then(() => {
            res.redirect('/admin?msg=Data berhasil dihapus.&type=error')
        })
        .catch((err) => {
            res.status(404).send(err);
        })
}

let update = function (req, res, next) {
    let { idadmin, email, nama, password } = req.body;
    let entitasAdmin = new Admin({ idadmin, email, nama, password });
    entitasAdmin.update()
        .then(() => {
            res.redirect('/admin?msg=Data berhasil diubah.&type=success')
        })
        .catch((err) => {
            res.status(404).send(err);
        })
}



module.exports = { create, read, update, delete_ }