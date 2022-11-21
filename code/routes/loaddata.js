const express = require('express');
const router = express.Router();
const sql = require('mssql');
const fs = require('fs');


router.get('/', function(req, res, next) {
    (async function() {
        try {
            res.setHeader('Content-Type', 'text/html');
            res.write('<title>Data Loader</title>');
            res.write('<h1>Connecting to database.</h1><p>');
            try{
                console.log("starting 1")
                let pool = await sql.connect({    
                    server: 'cosc304_sqlserver',
                    database: 'master',
                    user: 'sa', 
                    password: '304#sa#pw',
                    options: {      
                      encrypt: false,      
                      enableArithAbort:false,
                      database: 'master'
                    }
                  });
                let createDatabase = "CREATE DATABASE orders;"
                await pool.request().query(createDatabase)
                console.log("ending 1")
            }catch(err){
                console.log("createDBError:")
                console.dir(err)
            }
            console.log("starting 2")
            let pool = await sql.connect({    
                  server: 'cosc304_sqlserver',
                  database: 'orders',
                  user: 'sa', 
                  password: '304#sa#pw',
                  options: {      
                    encrypt: false,      
                    enableArithAbort:false,
                  }
                })
            let data = fs.readFileSync("./ddl/SQLServer_orderdb.ddl", { encoding: 'utf8' });
            let commands = data.split(";");
            for (let i = 0; i < commands.length; i++) {
                let command = commands[i];
                let result = await pool.request().query(command);
                res.write('<p>' + JSON.stringify(result) + '</p>')
            }
            res.write('"<h2>Database loading complete!</h2>')
            res.end();
            
        } catch(err) {
            console.log("later error:")
            console.dir(err);
            res.end();
        }
    })();
});

module.exports = router;
