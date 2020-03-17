const mysql = require('mysql');
const db = require('../connection/Database');
const promisify = require('util').promisify


let Admin = function (params) {
    this.idadmin = params.idadmin || 0;
    this.email = params.email || "";
    this.nama = params.nama || "";
    this.password = params.password || "";
}

Admin.prototype.create = function () {
    return new Promise((resolve, reject) => {
        promisify(db.getConnection)()
            .then((connection) => {
                connection.query(`INSERT INTO admin VALUES (NULL,'${this.email}','${this.nama}','${this.password}');`, (row, fields) => {
                    resolve();
                })
                connection.release();
            }).catch((err) => {
                reject(err);
            })
    })
}

Admin.prototype.read = function () {
    return new Promise((resolve, reject) => {
        promisify(db.getConnection)()
            .then(connection => {
                connection.query(`SELECT * FROM admin`, (row, fields) => {
                    resolve(fields);
                })
                connection.release();
            }).catch((err) => {
                reject(err);
            })
    })


}

Admin.prototype.update = function () {
    return new Promise((resolve, reject) => {
        promisify(db.getConnection)()
            .then(connection => {
                connection.query(`UPDATE admin SET email='${this.email}', nama='${this.nama}', password='${this.password}' WHERE id_admin=${this.idadmin}`, (row, fields) => {
                    resolve(fields);
                })
                connection.release();
            }).catch(err => {
                reject(err);
            })
    })
}

Admin.prototype.delete = function () {
    return new Promise((resolve, reject) => {
        promisify(db.getConnection)()
            .then(connection => {
                connection.query(`DELETE FROM admin WHERE id_admin=${this.idadmin}`, (row, fields) => {
                    resolve();
                })
                connection.release();
            }).catch((err) => {
                reject(err);
            })
    })
}

module.exports = Admin;