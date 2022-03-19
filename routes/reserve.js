import express from 'express';
import pool from '../db.js';
import {authenticateToken} from '../middleware/authorization.js';

let date_ob = new Date();
let min = date_ob.getMinutes()
if (min < 10) {
         '0' + min;
    }


let date = date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + ("0" + date_ob.getDate()).slice(-2);
let currentTime = date_ob.getHours() + ":" + min;
let date2 = '2022-03-20'; 
let timeStander = '12:00'
let lastDayTime = '23:59'

const router = express.Router(); 

router.post("/reserve", authenticateToken, async (req, res) =>{

    const {start_at, end_at, table} = req.body;

    try{
        if(req.body.start_at < currentTime) { 
            console.log(req.body.start_at + 'bbgb' + currentTime)
           return res.json('Your can only reserve on upcomming times!');}
    if(req.body.start_at >= timeStander && req.body.end_at <= lastDayTime && req.body.start_at < req.body.end_at){
        // console.log()
        // res.send("you made it")

        const check = await pool.query('SELECT * FROM reservation WHERE (table_num = $1 And start_at <= $2 And end_at > $2) OR (table_num = $1 AND start_at < $3 And end_at >= $3) OR (table_num = $1 AND start_at >= $2 And end_at <= $3)', [table,start_at,end_at])
        const seats = await pool.query('SELECT * FROM tables WHERE id = $1', [table])

        if(check.rows.length === 0) {
            const reserve = await pool.query('INSERT INTO reservation (table_num, date, start_at, end_at, seats) VALUES ($1,$2,$3,$4,$5)', [table, date, start_at, end_at, seats.rows[0]['seats']])
            res.status(200).json('Your reservarion made successfully!');
        }
        else {
            // console.log(check.rows)
            res.json("Time conflicts with an existing reservation!")
        }


    }else res.json("No reservation made!")

    // console.log(req.body)
    }catch (error) {
        res.status(401).json({error: error.message});
      }
    
})

export default router;