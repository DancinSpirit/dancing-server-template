/* Server Setup */
const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ejs = require('ejs');
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended:true}));

/* Authorization Setup */
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require("bcryptjs");

/* Database Setup */
const db = require("./models");

/* Variable Setup */
require("dotenv").config();
const PORT = process.env.PORT;

/* Create Session */
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 1
    }  
}));

/* Send User Information */
app.use(async function(req,res,next){
    if(req.session.currentUser){
        req.session.currentUser = await db.User.findById(req.session.currentUser._id)
        app.locals.user = req.session.currentUser;
    }else{
        app.locals.user = false;
    }
    next();
})

/* Login */
app.post("/login", async function(req, res){
    const foundUser = await db.User.findOne({username: req.body.username});
    if(!foundUser) return res.send(false)
    if(!foundUser) return res.send({loggedIn: false, error: "That username doesn't exist!"})
    const match = await bcrypt.compare(req.body.password, foundUser.password);
    if(!match) return res.send({loggedIn: false, error: "Password Invalid"});
    req.session.currentUser = foundUser;
    return res.send({loggedIn: true, user: foundUser});
})
/* Register */
app.post("/register", async function(req, res){
    const foundUser = await db.User.findOne({username: req.body.username});
    if(foundUser) return res.send({registered: false, error: "This username already exists!"});
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;
    const newUser = await db.User.create(req.body);
    req.session.currentUser = newUser;
    app.locals.user = req.session.currentUser;
    return res.send({registered: true, user: foundUser});
})
/* Logout */
app.post("/logout", async function(req,res){
    req.session.currentUser = false;
    req.session.currentPlayer = false;
    return res.send();
})

/* Home Page Loading */
app.get("/", function(req,res){
    res.render('base',{states: ["start"], databaseObjects: [false], customData: [false]});
})

/* Page Loading */
app.get("/*", function(req, res){
    let states = [];
    for(let x=1; x<req.url.split("/").length; x++){
        states.push(req.url.split("/")[x]);
    }
    let databaseObjects = [];
    let customData = [];
    if(req.body.databaseObjects){
        databaseObjects = req.body.databaseObjects;
    }else{
        for(let x=0; x<states.length; x++){
            databaseObjects[x] = false;
        }
    }
    if(req.body.customData){
        customData = req.body.customData;
    }else{
        for(let x=0; x<states.length; x++){
            customData[x] = false;
        }
    }
    res.render('base',{states: states, databaseObjects: databaseObjects, customData: customData});
})

/* Database Loading */
app.get("/data/:databaseObject/:id", async function(req,res){
    const data = await eval(`db.${req.params.databaseObject.charAt(0).toUpperCase() + req.params.databaseObject.slice(1)}.findById('${req.params.id}')`)
    res.send(data);
})

/* Database Updating */
app.post("/update/:databaseObject/:id", async function(req,res){
    let databaseObject = req.params.databaseObject.charAt(0).toUpperCase() + req.params.databaseObject.slice(1);
    let foundObject = await eval(`db.${databaseObject}.findByIdAndUpdate('${req.params.id}',${JSON.stringify(req.body)})`);
    res.send(foundObject);
})

/* Component Loading */
app.post("/component/:component", async function(req,res){
    let data = {};
    let url = `components/${req.params.component.toLowerCase()}`;
    if((req.body.customData != "false")&&(typeof req.body.customData != "undefined")){
        data = req.body.customData;
    }
    if(req.body.databaseObjects != "false"&&(typeof req.body.databaseObjects != "undefined")){
        for(let x=0; x<req.body.databaseObjects.length; x++){
            data[req.body.databaseObjects[x].name]  = await eval(`db.${req.body.databaseObjects[x].name}.findById('${req.body.databaseObjects[x].id}')`)
        }
    }
    console.log(data)
    data.user = app.locals.user;
    ejs.renderFile("views/"+url+".ejs", data, (err, result) => {
        if (err) {
            res.render("error",{error:err});
        }
            res.send(result);
    });
})

/* Socket.IO */
io.on('connection', (socket) => {
    console.log('User Connected!');
});

http.listen(PORT, function(){
    console.log(`Live at http://localhost:${PORT}/`);
})