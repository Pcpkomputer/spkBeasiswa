const mysql = require('mysql');
const db = require('../connection/Database');
const promisify = require('util').promisify

let Mahasiswa = function (params) {
    this.nim = params.nim || "";
    this.namamahasiswa = params.namamahasiswa || "";
    this.jeniskelamin = params.jeniskelamin || "";
    this.agama = params.agama || "";
    this.tempatlahir = params.tempatlahir || "";
    this.tanggallahir = params.tanggallahir || "";
    this.alamat = params.alamat || "";
    this.foto = params.foto || "";
}

Mahasiswa.prototype.create = function () {
    return new Promise((resolve, reject) => {
        promisify(db.getConnection)()
            .then((connection) => {
                connection.query(`INSERT INTO mahasiswa VALUES ('${this.nim}','${this.namamahasiswa}','${this.jeniskelamin}','${this.agama}','${this.tempatlahir}','${this.tanggallahir}','${this.alamat}','${this.foto}');`, (row, fields) => {
                    resolve();
                })
                connection.release();
            }).catch((err) => {
                reject(err);
            })
    })
}

Mahasiswa.prototype.read = function () {
    return new Promise((resolve, reject) => {
        promisify(db.getConnection)()
            .then(connection => {
                connection.query(`SELECT * FROM mahasiswa`, (row, fields) => {
                    resolve(fields);
                })
                connection.release();
            }).catch((err) => {
                reject(err);
            })
    })


}

Mahasiswa.prototype.update = function () {
    return new Promise((resolve, reject) => {
        promisify(db.getConnection)()
            .then(connection => {
                if (this.foto.length > 0) {
                    connection.query(`UPDATE mahasiswa SET nama_mahasiswa='${this.namamahasiswa}', jenis_kelamin='${this.jeniskelamin}', agama='${this.agama}', tempat_lahir='${this.tempatlahir}', tanggal_lahir='${this.tanggallahir}', alamat='${this.alamat}', foto='${this.foto}' WHERE nim='${this.nim}'`, (row, fields) => {
                        resolve(fields);
                    })
                } else {
                    connection.query(`UPDATE mahasiswa SET nama_mahasiswa='${this.namamahasiswa}', jenis_kelamin='${this.jeniskelamin}', agama='${this.agama}', tempat_lahir='${this.tempatlahir}', tanggal_lahir='${this.tanggallahir}', alamat='${this.alamat}' WHERE nim='${this.nim}'`, (row, fields) => {
                        resolve(fields);
                    })
                }
                connection.release();
            }).catch(err => {
                reject(err);
            })
    })
}

Mahasiswa.prototype.delete = function () {
    return new Promise((resolve, reject) => {
        promisify(db.getConnection)()
            .then(connection => {
                connection.query(`DELETE FROM mahasiswa WHERE nim='${this.nim}'`, (row, fields) => {
                    resolve();
                })
                connection.release();
            }).catch((err) => {
                reject(err);
            })
    })
}

module.exports = Mahasiswa;