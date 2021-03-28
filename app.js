//Npm modules
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

//Database connection
const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_DATABASE
});

app.use(express.static('public'));

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());

//Html engine
app.set('view engine','hbs');

db.connect((err)=>{
    if(err) console.log(err);
    else console.log('connected MySql');
});

//routes
app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));

app.listen(3000, () => console.log(`App listening on port 3000!`));