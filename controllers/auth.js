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

};

exports.login = async (req,res)=>{
    try {
        const{email,password} = req.body;
        if(!email || !password){
            return res.status(400).render('login',{
                message:'Please provide an email and password'
            });
        };
        db.query('SELECT * FROM users WHERE email = ?',[email],async(err,result)=>{
            if(!result || !(await bcrypt.compare(password,result[0].password))){
                res.status(401).render('login',{
                    message:'Invalid email or password'
                })
            }else{
                const id = result[0].id;

                const token = jwt.sign({id},process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES_IN
                })
                console.log(token);

                const cookieOptions = {
                    expries:new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES *24*60*60*1000
                        ),
                    httpOnly:true,
                }
                res.cookie('jwt',token,cookieOptions);
                res.status(200).redirect('/');
            }
        })
    } catch (error) {
        console.log(error);
    };
};