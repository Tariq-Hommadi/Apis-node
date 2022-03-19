import express from 'express';
import pool from '../db.js';
import {authenticateToken} from '../middleware/authorization.js';

let date_ob = new Date();
// let date = date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + ("0" + date_ob.getDate()).slice(-2);
let currentTime = date_ob.getHours() + ":" + date_ob.getMinutes();
// let date2 = '2022-03-20'; 
// let currentTime = '12:00:00'
let lastDayTime = '23:59:00'
let list = []

const router = express.Router(); 

router.get("/times", authenticateToken, async (req, res) => {

    try{

        const seats = await pool.query('SELECT * FROM tables WHERE seats >= $1 ORDER BY seats asc LIMIT 1', [req.body.seats])
        if(seats.rows.length === 0) return res.json("Unfortunately we do not have the required table seats");

        const tables = await pool.query('SELECT * FROM tables WHERE seats = $1 ', [seats.rows[0]['seats']])

        if(tables.rows.length === 0) return res.status(200).json({Table: {from: currentTime, to: lastDayTime}});

        if(tables.rows.length>1){

            for(let i=0; i<tables.rows.length; i++){
                let tableName = 'Table ' + (i+1)
                list.push([tableName])
                let time = currentTime
                const reservedSlots = await pool.query('SELECT * FROM reservation WHERE seats = $1 And table_num = $2 ORDER BY start_at asc', [seats.rows[0]['seats'], tables.rows[i]['id']])

                for(let j=0; j<reservedSlots.rows.length; j++){

                    if(time < reservedSlots.rows[j]['start_at']){

                        let end = reservedSlots.rows[j]['start_at']
                        list.push({from: time, to: end})
                        time = reservedSlots.rows[j]['end_at']

                    }
                }

                if(time<lastDayTime){list.push({from: time, to: lastDayTime})}
                
            }

            if(list.length === 1) return res.json("Unfortunately all tables with required seats reserved");
            res.send(list)
            list = []
    }

    else {
    let tableName = 'Table'
    list.push([tableName])
    
    let time = currentTime

    const reservedSlots = await pool.query('SELECT * FROM reservation WHERE seats = $1 ORDER BY start_at asc', [seats.rows[0]['seats']])
    if(reservedSlots.rowCount.length === 0) {
        list.push({from: time, to: lastDayTime})
        if(list.length === 1) return res.json("Unfortunately all tables with required seats reserved");
        res.send(list)
    }
   
    for(let j=0; j<reservedSlots.rows.length; j++){

        if(time < reservedSlots.rows[j]['start_at']){

            let end = reservedSlots.rows[j]['start_at']
            list.push({from: time, to: end})
            time = reservedSlots.rows[j]['end_at']

        }
    }

    if(time<lastDayTime) {list.push({from: time, to: lastDayTime})}

    if(list.length === 1) return res.json("Unfortunately all tables with required seats reserved");
    res.send(list)
    list = []
        
    }

    } catch (error) {
      res.status(401).json({error: error.message});
    }

})

export default router;
