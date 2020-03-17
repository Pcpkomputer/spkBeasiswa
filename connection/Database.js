
var MySQL = require("mysql");

connectionPool = MySQL.createPool(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'spk2020'
    }
);

var getConnection = function (done) {
    connectionPool.getConnection(done);
};

module.exports = { getConnection: getConnection };