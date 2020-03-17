let Mahasiswa = require('../models/Mahasiswa');
const flash = require('connect-flash');
const path = require('path');

let create = function (req, res, next) {
    try {
        if (req.session.login === true) {
            if (req.files) {
                let payload = req.body;

                let { nim, namamahasiswa, jeniskelamin, agama, tempatlahir, tanggallahir, alamat } = payload;
                let foto = (req.files.foto.name.match('.jpg') ? `${nim}.jpg` : `${nim}.png`)
                req.files.foto.mv(path.join(__dirname, '../', "public", "image", `${(req.files.foto.name.match('.jpg') ? `${nim}.jpg` : `${nim}.png`)}`));

                //Object.keys(payload).map((val, index) => {
                //    payload[val] = escape(payload[val]);
                //})


                let entitasMahasiswa = new Mahasiswa({ nim, namamahasiswa, jeniskelamin, agama, tempatlahir, tanggallahir, alamat, foto: foto });
                entitasMahasiswa.read()
                    .then((readValue) => {
                        entitasMahasiswa.create()
                            .then(() => {
                                // req.flash('flash', { msg: "Data berhasil dimasukkan.", type: "success" })
                                res.redirect('/mahasiswa?msg=Data berhasil dimasukkan.&type=success');
                            })
                    })


            }
            else {
                let foto = 'nofoto.jpg'
                let payload = req.body;
                //Object.keys(payload).map((val, index) => {
                //   payload[val] = escape(payload[val]);
                //})
                let { nim, namamahasiswa, jeniskelamin, agama, tempatlahir, tanggallahir, alamat } = payload;

                let entitasMahasiswa = new Mahasiswa({ nim, namamahasiswa, jeniskelamin, agama, tempatlahir, tanggallahir, alamat, foto });
                entitasMahasiswa.read()
                    .then((readValue) => {
                        entitasMahasiswa.create()
                            .then(() => {
                                //req.flash('flash', { msg: "Data berhasil dimasukkan.", type: "success" })
                                res.redirect('/mahasiswa?msg=Data berhasil dimasukkan.&type=success');
                            })
                    })

            }
        }
        else {
            res.status(401).send("unauthorized")
        }

    } catch (error) {
        console.log(error);
        res.status(404).send(error)
    }


}

let read = function (req, res, next) {
    if (req.session.login === true) {
        let entitasMahasiswa = new Mahasiswa({});
        entitasMahasiswa.read()
            .then((values) => {
                res.send(values);
            })
            .catch((err) => {
                res.status(404).send(err);
            })
    } else {
        res.status(501).send('unauthorized');
    }

}

let delete_ = function (req, res, next) {
    try {
        if (req.session.login === true) {
            let { nim } = req.body;
            let entitasMahasiswa = new Mahasiswa({ nim })
            entitasMahasiswa.delete()
                .then(() => {
                    entitasMahasiswa.read()
                        .then((readValue) => {
                            //req.flash('flash', { msg: "Data berhasil dihapus.", type: "success" })
                            res.redirect('/mahasiswa?msg=Data berhasil dihapus.&type=error');
                        })
                }).catch((err) => {
                    res.status(404).send(err);
                })


        } else {
            res.status(501).send('unauthorized');
        }
    } catch (error) {
        res.status(404).send(error);
    }

}

let update = function (req, res, next) {
    try {
        if (req.files) {

            let { nim, namamahasiswa, jeniskelamin, agama, tempatlahir, tanggallahir, alamat } = req.body;
            let foto = req.files.foto.name.match('.jpg') ? `${nim}.jpg` : `${nim}.png`;
            console.log(path.join(__dirname, "/public", "image", `${(req.files.foto.name.match('.jpg') ? `${nim}.jpg` : `${nim}.png`)}`));
            req.files.foto.mv(path.join(__dirname, "../", "public", "image", `${(req.files.foto.name.match('.jpg') ? `${nim}.jpg` : `${nim}.png`)}`));
            let entitasMahasiswa = new Mahasiswa({ nim, namamahasiswa, jeniskelamin, agama, tempatlahir, tanggallahir, alamat, foto: foto })
            entitasMahasiswa.update()
                .then(() => {
                    entitasMahasiswa.read()
                        .then((readValue) => {
                            //console.log("asuuuuu");
                            //req.flash('flash', { msg: "Data berhasil diubah.", type: "success" })
                            res.redirect('/mahasiswa?msg=Data berhasil diubah.&type=success');
                        })

                }).catch((err) => {
                    res.status(404).send(err);
                })
        }
        else {
            let { nim, namamahasiswa, jeniskelamin, agama, tempatlahir, tanggallahir, alamat } = req.body;
            let entitasMahasiswa = new Mahasiswa({ nim, namamahasiswa, jeniskelamin, agama, tempatlahir, tanggallahir, alamat, foto: "" })
            entitasMahasiswa.update()
                .then(() => {
                    entitasMahasiswa.read()
                        .then((readValue) => {
                            //req.flash('flash', { msg: "Data berhasil diubah.", type: "success" })
                            res.redirect('/mahasiswa?msg=Data berhasil diubah.&type=success');
                        })

                }).catch((err) => {
                    res.status(404).send(err);
                })
        }



    } catch (error) {
        res.status(404).send(error);
    }

}



module.exports = { create, read, update, delete_ }