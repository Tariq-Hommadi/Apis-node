import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { jwtTokens } from '../jwt-tokens.js';

const router = express.Router();



//register a new user
router.post("/register", async (req, res) =>{

    // res.send(req.body) 
    const {name, user_num, password } = req.body;

    // const sql = "select user-no from employee where user_no = $1"

    if (user_num.length == 4) {
    const user = await pool.query('SELECT user_num FROM employee WHERE user_num = $1', [user_num]);
    if (user.rows.length === 0){

        // check the password length
        if (password.length >= 6){
            // const hash =  await bcrypt.hash(req.body.password, 10)
            // res.send("you made it")

            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                // res.send("registered successfully!")
                const newEmployee = await pool.query(
                    'INSERT INTO employee (user_num,name,password) VALUES ($1,$2,$3)'
                    , [user_num, name, hashedPassword]);
    
                    return res.status(200).json("registered successfully!")

              } catch (error) {
                res.status(500).json({error: error.message});
              }


        }
        else return res.status(401).json({error:"Passwords must be at least 6 characters long.."})
        

    }
    else return res.status(401).json({error:"User already exists.."})

}
else return res.status(401).json({error:"User number should be 4 digit"});

})


router.post('/login', async (req, res) => {
    try {
        
      // console.log(req.cookies, req.get('origin'));
      const { user_num, password } = req.body;
      const users = await pool.query('SELECT * FROM employee WHERE user_num = $1', [user_num]);
      if (users.rows.length === 0) return res.status(401).json({error:"User number is incorrect"});
      //PASSWORD CHECK
      const validPassword = await bcrypt.compare(password, users.rows[0].password);
      if (!validPassword) return res.status(401).json({error: "Incorrect password"});
      // return res.status(200).json("logged in successfully!")
      //JWT
      let tokens = jwtTokens(users.rows[0]);//Gets access and refresh tokens
      res.cookie('refresh_token', tokens.refreshToken, {...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true});
    res.json(tokens);
    // res.json({hh: "grr"})
    } catch (error) {
      res.status(401).json({error: error.message});
    }
  
  });

  export default router;