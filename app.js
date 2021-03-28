//Npm modules
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');
const { get } = require('http');

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

//Html engine
app.set('view engine','hbs');

db.connect((err)=>{
    if(err) console.log(err);
    else console.log('connected MySql');
});

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/register', (req, res) => {
    res.render('register')
})

app.listen(3000, () => console.log(`Example app listening on port 3000!`));