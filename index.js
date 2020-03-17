const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
var mysql = require('mysql')
const session = require('express-session');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const { escape } = require('./module');
var flash = require('connect-flash');
let { getConnection } = require('./connection/Database');

////////////////////////////////////////////////////
let mahasiswaRouter = require('./routes/Mahasiswa');
let adminRouter = require('./routes/Admin');
let pendaftarRouter = require('./routes/Pendaftaran')
///////////////////////////////////////////////////


////////////////// MODELS /////////////////////////
let Mahasiswa = require('./models/Mahasiswa');
let Pendaftar = require('./models/Pendaftaran');
let Admin = require('./models/Admin');
///////////////////////////////////////////////////

nunjucks.configure('views', {
    express: app,
    autoescape: true
});
app.set('view engine', 'html');

app.use(fileUpload());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "anitaBANGSAT",
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.use('/image', function (req, res, next) {
    if (req.session.login === true) {
        next();
    } else {
        res.redirect(301, "/");
    }
}, express.static('public/image'));

///////////////// CUSTOM MODULE //////////////

let parseTanggal = (tanggal) => {
    let d = new Date(tanggal);
    return `${d.getDate()} - ${d.getMonth() + 1} - ${d.getFullYear()}`;
}

let parseTanggal_ = (tanggal) => {
    let d = new Date(tanggal);
    let m = d.getMonth() + 1

    //console.log(m.toString().length);

    return `${d.getFullYear()}-${(m.toString().length > 1) ? `${d.getMonth() + 1}` : `0${d.getMonth() + 1}`}-${d.getDate()}`;
}


//////////////// LOGOUT //////////////////////

app.get("/destroy", (req, res) => {
    req.session.destroy();
    res.render('index');
})


/////////////////////////////////////////////

app.use('/api/v1/mahasiswa', mahasiswaRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/pendaftar', pendaftarRouter);

/////////////////////////////////////////////

app.get('/spk/penerimabeasiswa', (req, res, next) => {
    if (req.session.login === true) {
        if (req.query.tahun && req.query.semester) {
            getConnection((err, connection) => {
                connection.query(`SELECT MIN(pendapatan) AS minpendapatan, MAX(ipk) AS maxipk, MAX(saudara) AS maxsaudara FROM pendaftaran WHERE tahun=${req.query.tahun} AND semester=${req.query.semester}`, (row, fields) => {
                    let data = fields[0];
                    let minpendapatan = data.minpendapatan;
                    let maxipk = data.maxipk;
                    let maxsaudara = data.maxsaudara;
                    connection.query(`SELECT pendaftaran.*, mahasiswa.nama_mahasiswa FROM pendaftaran INNER JOIN mahasiswa ON mahasiswa.nim=pendaftaran.nim WHERE tahun=${req.query.tahun} AND semester=${req.query.semester}`, (row, fields) => {
                        let payload = [];
                        fields.map((v, i) => {

                            let npendapatan = (minpendapatan / v.pendapatan).toFixed(2);
                            let nipk = (v.ipk / maxipk).toFixed(2);
                            let nsaudara = (v.saudara / maxsaudara).toFixed(2);
                            let prefensi = (0.5 * npendapatan) + (0.3 * nipk) + (0.2 * nsaudara);
                            p = {
                                id_daftar: v.id_daftar,
                                tanggal_daftar: parseTanggal_(v.tanggal_daftar),
                                semester: v.semester,
                                nama: v.nama_mahasiswa,
                                tahun: v.tahun,
                                nim: v.nim,
                                pendapatan: v.pendapatan,
                                ipk: v.ipk,
                                saudara: v.saudara,
                                npendapatan: npendapatan,
                                nipk: nipk,
                                nsaudara: nsaudara,
                                prefensi: prefensi.toFixed(2)
                            }

                            payload.push(p);
                        })
                        connection.query(`SELECT DISTINCT(tahun) FROM pendaftaran;`, (row, fields) => {
                            let tahun = fields;
                            res.render('PenerimaBeasiswa', { tahun: tahun, flash: { msg: req.query.msg, type: req.query.type }, email: req.session.email, nama: req.session.nama, id_admin: req.session.id_admin, data: payload, parsetanggal: parseTanggal_ });
                        })

                    })
                })
                connection.release();
            })
        } else {
            getConnection((err, connection) => {
                connection.query(`SELECT DISTINCT(tahun) FROM pendaftaran;`, (row, fields) => {
                    let tahun = fields;
                    res.render('PenerimaBeasiswa', { tahun: tahun, flash: { msg: req.query.msg, type: req.query.type }, email: req.session.email, nama: req.session.nama, id_admin: req.session.id_admin, data: [], parsetanggal: parseTanggal_ });
                })
                connection.release();
            })

        }
    } else {
        res.redirect('/')
    }


})

app.post('/admin/endpoint', (req, res) => {
    if (req.body.submit === 'update') {
        res.redirect(307, '/api/v1/admin/update');
    }
    if (req.body.submit === 'delete') {
        res.redirect(307, '/api/v1/admin/delete');
    }
})


app.get('/admin/:idadmin', (req, res, next) => {
    if (req.session.login === true) {
        let id = req.params.idadmin;
        getConnection((err, connection) => {
            connection.query(`SELECT * FROM admin WHERE id_admin='${id}'`, (row, fields) => {
                res.render('DetailAdmin', { flash: { msg: req.query.msg, type: req.query.type }, email: req.session.email, nama: req.session.nama, id_admin: req.session.id_admin, data: fields[0], parsetanggal: parseTanggal_ })
            })
        })

    } else {
        res.redirect('/')
    }

})

app.get('/admin', (req, res, next) => {
    if (req.session.login === true) {
        let entitasAdmin = new Admin({});
        entitasAdmin.read()
            .then((readValue) => {
                res.render('Admin', { flash: { msg: req.query.msg, type: req.query.type }, email: req.session.email, nama: req.session.nama, id_admin: req.session.id_admin, data: readValue, parsetanggal: parseTanggal_ })
            })
            .catch((err) => {
                console.log(err);
            })
    } else {
        res.redirect('/')
    }

})


app.post('/pendaftar/endpoint', (req, res) => {
    if (req.body.submit === 'update') {
        res.redirect(307, '/api/v1/pendaftar/update');
    }
    if (req.body.submit === 'delete') {
        res.redirect(307, '/api/v1/pendaftar/delete');
    }
})

app.get('/pendaftar/:iddaftar', (req, res, next) => {
    let id = req.params.iddaftar;
    getConnection((err, connection) => {
        connection.query(`SELECT * FROM pendaftaran WHERE id_daftar='${id}'`, (row, fields) => {
            res.render('DetailPendaftaran', { flash: { msg: req.query.msg, type: req.query.type }, email: req.session.email, nama: req.session.nama, id_admin: req.session.id_admin, data: fields[0], parsetanggal: parseTanggal_ })
        })
    })

})

app.get('/pendaftar', (req, res, next) => {
    if (req.session.login === true) {
        let entitasPendaftar = new Pendaftar({});
        entitasPendaftar.read()
            .then((readValue) => {
                res.render('Pendaftar', { flash: { msg: req.query.msg, type: req.query.type }, email: req.session.email, nama: req.session.nama, id_admin: req.session.id_admin, data: readValue, parsetanggal: parseTanggal_ })
            }).catch((err) => {
                res.status(404).send(err);
            })
    } else {
        res.redirect('/')
    }
})


app.post('/mahasiswa/endpoint', (req, res) => {
    if (req.body.submit === 'update') {
        res.redirect(307, '/api/v1/mahasiswa/update');
    }
    if (req.body.submit === 'delete') {
        res.redirect(307, '/api/v1/mahasiswa/delete');
    }
})


app.get('/mahasiswa/:nim', (req, res) => {
    if (req.session.login === true) {
        let nim = req.params.nim;
        getConnection((_, connection) => {
            connection.query(`SELECT * FROM mahasiswa WHERE nim='${nim}'`, (row, fields) => {
                if (fields.length > 0) {
                    let data = fields[0];
                    res.render('DetailMahasiswa', { flash: { msg: req.flash('msg'), type: req.flash('type') }, email: req.session.email, nama: req.session.nama, id_admin: req.session.id_admin, data: data, parsetanggal: parseTanggal_ })
                } else {
                    res.redirect('/mahasiswa');
                }
            })
        })
    }
    else {
        res.redirect(301, "/")
    }
})

app.get('/mahasiswa', (req, res) => {
    entitasMahasiswa = new Mahasiswa({});
    if (req.session.login === true) {
        entitasMahasiswa.read()
            .then((readValue) => {
                res.render('Mahasiswa', { flash: { msg: req.query.msg, type: req.query.type }, email: req.session.email, nama: req.session.nama, id_admin: req.session.id_admin, data: readValue, parsetanggal: parseTanggal_ })


            }).catch((err) => {
                res.status(404).send(err);
            })
    }
    else {
        res.redirect(301, '/');
    }

})



app.get('/', (req, res) => {
    if (req.session.login === true) {
        res.redirect(301, '/Mahasiswa');
    } else {
        res.render("index");
    }

})


/////////////////////////// LOGIN /////////////////////////////////////////////////////

app.post('/', (req, res) => {
    let { email, password } = req.body;

    getConnection((_, connection) => {
        connection.query(`SELECT * FROM admin WHERE email='${email}'`, (_, fields) => {
            if (fields.length > 0) {
                let result = fields[0];
                if (result.email === email && result.password === password) {
                    req.session.login = true;
                    req.session.email = result.email
                    req.session.nama = result.nama
                    req.session.id_admin = result.id_admin

                    res.redirect(301, '/mahasiswa');
                } else {
                    res.render("index", { alert: "Password yang dimasukkan salah!" });
                }
            } else {
                res.render("index", { alert: "Akun tidak ditemukan!" });
            }
            connection.release();
        })
    })



})

/////////////////////////////////////////////////////////////////////////////////////////

app.listen(process.env.PORT || 5000, () => {
    console.log('server listening');
})

