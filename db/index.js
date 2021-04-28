"use strict";

const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'us-cdbr-east-03.cleardb.com', //us-cdbr-east-03.cleardb.com
    user: 'b277c48dc5a180', //b277c48dc5a180
    password: '4ba00385', //4ba00385
    database: 'heroku_a307c0ce0eb4d98',//heroku_a307c0ce0eb4d98
    //port: 3306,
    supportBigNumbers: true,
    bigNumberStrings: true,
});

function promiseQuery(text, params) {
    return new Promise(function (fulfilled, rejected) {
        if (params !== null && params !== undefined && params.length > 0) {
            pool.query(text, params, function (error, results, fields) {
                if (error) {
                    return rejected(error);
                }

                fulfilled(results);
            });
        } else {
            pool.query(text, function (error, results, fields) {
                if (error) {
                    return rejected(error);
                }

                fulfilled(results);
            });
        }
    });
}

module.exports = {
    query: (text, params) => promiseQuery(text, params),
};
