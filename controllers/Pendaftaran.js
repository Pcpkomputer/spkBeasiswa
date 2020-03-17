let Pendaftaran = require('../models/Pendaftaran');

let create = function (req, res, next) {

    let { tanggaldaftar, semester, tahun, nim, pendapatan, ipk, saudara } = req.body;
    let entitasPendaftar = new Pendaftaran({ tanggaldaftar, semester, tahun, nim, pendapatan, ipk, saudara });
    entitasPendaftar.create()
        .then(() => {
            res.redirect('/pendaftar?msg=Data berhasil dimasukkan.&type=success');
        }).catch((err) => {
            console.log(err);
        })
}

let read = function (req, res, next) {
    let { tanggaldaftar, semester, tahun, nim, pendapatan, ipk, saudara } = req.body;
    let entitasPendaftar = new Pendaftaran({ tanggaldaftar, semester, tahun, nim, pendapatan, ipk, saudara });
    entitasPendaftar.read()
        .then((readValue) => {
            res.send(readValue);
        }).catch((err) => {
            console.log(err);
        })
}

let update = function (req, res, next) {
    let { iddaftar, tanggaldaftar, semester, tahun, nim, pendapatan, ipk, saudara } = req.body;
    let entitasPendaftar = new Pendaftaran({ iddaftar, tanggaldaftar, semester, tahun, nim, pendapatan, ipk, saudara });
    entitasPendaftar.update()
        .then(() => {
            res.redirect('/pendaftar?msg=Data berhasil diubah.&type=success');
        }).catch((err) => {
            console.log(err);
        })
}

let delete_ = function (req, res, next) {
    let { iddaftar, tanggaldaftar, semester, tahun, nim, pendapatan, ipk, saudara } = req.body;
    let entitasPendaftar = new Pendaftaran({ iddaftar, tanggaldaftar, semester, tahun, nim, pendapatan, ipk, saudara });
    entitasPendaftar.delete()
        .then(() => {
            res.redirect('/pendaftar?msg=Data berhasil dihapus.&type=error');
        }).catch((err) => {
            console.log(err);
        })
}

module.exports = {
    create, read, update, delete_
}