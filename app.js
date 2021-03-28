//Npm modules
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

//Database connection
dbPass = process.env.DB_PASS;

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:dbPass,
    database:'nodejs-login'
});

db.connect((err)=>{
    if(err) console.log(err);
    else console.log('connected MySql');
});

app.get('/', (req, res) => {
    res.send('Home page')
});

app.listen(3000, () => console.log(`Example app listening on port 3000!`));