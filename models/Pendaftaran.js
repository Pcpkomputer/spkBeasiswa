const mysql = require('mysql');
const db = require('../connection/Database');
const promisify = require('util').promisify

let Pendaftaran = function (params) {
    this.iddaftar = params.iddaftar || ""
    this.tanggaldaftar = params.tanggaldaftar || "";
    this.semester = params.semester || "";
    this.tahun = params.tahun || "";
    this.nim = params.nim || "";
    this.pendapatan = params.pendapatan || "";
    this.ipk = params.ipk || "";
    this.saudara = params.saudara || "";
}

Pendaftaran.prototype.create = function () {
    return new Promise((resolve, reject) => {
        promisify(db.getConnection)()
            .then((connection) => {
                connection.query(`INSERT INTO pendaftaran VALUES (NULL,'${this.tanggaldaftar}','${this.semester}','${this.tahun}','${this.nim}','${this.pendapatan}','${this.ipk}','${this.saudara}');`, (row, fields) => {
                    resolve();
                })
                connection.release();
            }).catch((err) => {
                reject(err);
            })
    })
}

Pendaftaran.prototype.read = function () {
    return new Promise((resolve, reject) => {
        promisify(db.getConnection)()
            .then(connection => {
                connection.query(`SELECT pendaftaran.*, mahasiswa.nama_mahasiswa, mahasiswa.foto FROM pendaftaran INNER JOIN
                mahasiswa ON pendaftaran.nim=mahasiswa.nim`, (row, fields) => {
                        resolve(fields);
                    })
                connection.release();
            }).catch((err) => {
                reject(err);
            })
    })

}

Pendaftaran.prototype.update = function () {
    return new Promise((resolve, reject) => {
        promisify(db.getConnection)()
            .then(connection => {

                connection.query(`UPDATE pendaftaran SET tanggal_daftar='${this.tanggaldaftar}', 
                    semester='${this.semester}', tahun='${this.tahun}', nim='${this.nim}', 
                    pendapatan='${this.pendapatan}', ipk='${this.ipk}', saudara='${this.saudara}' WHERE id_daftar=${this.iddaftar}`, (row, fields) => {
                        resolve(fields);
                    })
                connection.release();
            }).catch(err => {
                reject(err);
            })
    })
}

Pendaftaran.prototype.delete = function () {
    return new Promise((resolve, reject) => {
        promisify(db.getConnection)()
            .then(connection => {
                connection.query(`DELETE FROM pendaftaran WHERE id_daftar=${this.iddaftar}`, (row, fields) => {
                    resolve();
                })
                connection.release();
            }).catch((err) => {
                reject(err);
            })
    })
}

module.exports = Pendaftaran;