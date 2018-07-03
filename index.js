var express=require("express");
var bodyParser=require('body-parser');
var app = express();
var authenticateController=require('./controller/auth');
var registerController=require('./controller/register');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
/* route to handle login and registration */
app.post('/api/register',registerController.register);
app.post('/api/authenticate',authenticateController.authenticate);
app.listen(3000);