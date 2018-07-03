var express = require('express');
var users = express.Router();
//var database = require('../Database/database');
var cors = require('cors')
var jwt = require('jsonwebtoken');
var token;
//exports.login;
var mysql = require('mysql');

var connection = mysql.createConnection({
   // connectionLimit: 100,
    host:'localhost',
    user:'root',
    password : '15061994',
   database : 'discussion_pannel'
    //port: 3000,
    //debug: false,
    //multipleStatements: true
});
connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... \n\n");  
    } else {
        console.log("Error connecting database ... \n\n");  
    }
    });
   // connection.end(function(err) {
     //   console.log("Connection closed \n\n");
     // });



users.use(cors());

process.env.SECRET_KEY = "devesh";

users.post('/register', function(req, res) {
console.log('robin');
//res.send('jdj');
    var today = new Date();
    var appData = {
        "error": 1,
        "data": ""
    };
    var userData = {
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "email": req.body.email,
        "password": req.body.password,
        //"created": today
    }

    //connection.Connect(function(err) {
      // if (err) {console.log('connected');
            //appData["error"] = 1;
            //appData["data"] = "Internal Server Error";
            //res.status(500).json(appData);
        //} else {
         connection.query('INSERT INTO user SET ?', userData, function(err, rows, fields) {
                if (!err) {
                    console.log('eroor');
                   appData.error = 0;
                   appData["data"] = "User registered successfully!";
                   //res.status(201).json(appData);
                } else {
                   appData["data"] = "Error Occured!";
                //   res.json('yun');
                    console.log('not eroor'); }
            });
           // connection.release();
           //connection.end(function(err) {
            //console.log("Connection closed of get 1\n\n");
          //});
          res.send('rahul');
        //}
    //});
});

users.post('/login', function(req, res) {
console.log('login');
    var appData = {};
    var email = req.body.email;
    var password = req.body.password;

   //connection.connect(function(err) {
   //     if (err) {
            //appData["error"] = 1;
          //  appData["data"] = "Internal Server Error";
            //res.status(500).json(appData);
        //} else {
            connection.query('SELECT * FROM user WHERE email = ?', [email], function(err, rows, fields) {
                if (err) {
                    appData.error = 1;
                    appData["data"] = "Error Occured!";
                    res.send('error');
                   // res.status(400).json(appData);
                } else {
                    if (rows.length > 0) {
                        if (rows[0].password == password) {
                            let token = jwt.sign(rows[0], process.env.SECRET_KEY, {
                                expiresIn: 1440
                            });
                            appData.error = 0;
                            appData["token"] = token;
                          //  res.status(200).json(appData);
                        } else {
                            appData.error = 1;
                            appData["data"] = "Email and Password does not match";
                            //res.status(204).json(appData);
                        }
                    } else {
                        appData.error = 1;
                        appData["data"] = "Email does not exists!";
                       // res.status(204).json(appData);
                    }
                }
            });
            //connection.release();
     //   }
   // });
});



          

users.use('/r',function(req, res, next) {
    var token = req.body.token || req.headers['token'];
    var appData = {};
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function(err) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Token is invalid";
                res.status(500).json(appData);
            } else {
                next();
            }
        });
    } else {
        appData["error"] = 1;
        appData["data"] = "Please robin send a token";
        res.status(403).json(appData);
    }
});

users.get('/getUsers', function(req, res) {

    var appData = {};

    connection.Connect(function(err) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query('SELECT *FROM users', function(err, rows, fields) {
                if (!err) {
                    appData["error"] = 0;
                    appData["data"] = rows;
                    res.status(200).json(appData);
                } else {
                    appData["data"] = "No data found";
                    res.status(204).json(appData);
                }
            });
            connection.release();
        }
    });
});

module.exports = users;