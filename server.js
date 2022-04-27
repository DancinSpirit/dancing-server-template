const express = require("express");
const session = require('express-session');
const app = express();
const db = require("./models");
require("dotenv").config();

const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended:true}));

const DancingServer = require('@dancingspirit/dancingserver');
DancingServer.create(app,db);

app.listen(PORT, function(){
    console.log(`Live at http://localhost:${PORT}/`);
})

//Just Add a .env with MONGODB_URI and PORT