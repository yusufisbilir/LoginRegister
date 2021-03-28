const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_DATABASE
});

exports.register = (req,res)=>{
    console.log(req.body);

    const {name,email,password,passwordConfirm} = req.body;

    db.query('SELECT email FROM users WHERE email = ?',[email],async (err,result)=>{
        if(err){
            console.log(err);
        };

        if(result.length>0){
            return res.render('register',{
                message:'That email is already in use'
            });

        }else if(password!==passwordConfirm){
            return res.render('register',{
                message:'Passwords do not match'
            });
        }


        let hashedPassword = await bcrypt.hash(password,8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?',{name:name,email:email,password:hashedPassword},(err,result)=>{
            if(err){
                console.log(err);
            }else{
                console.log(result);
                return res.render('register',{
                    message:'User Registered'
                });
            };
        });
    });

}