
const db = require(('./config/db')); // for database connection
const express = require("express"); // webserver
const bodyParser = require('body-parser');// capturing form data
const session = require('express-session'); //session managment
const MySQLStore = require('express-mysql-session')(session); //session managment
const dotenv = require('dotenv'); //
//initialize session management

dotenv.config();
const app = express();



//configure middleware

app.use(bodyParser.json()); //use json
app.use(bodyParser.urlencoded({ extended: true})); //capture form data

//configure session store

const sessionStore = new MySQLStore({}, db);

//configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 //1 hr -> 3600sec
    }
}));

app.use('/school/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`listening on port ${PORT}`);
});