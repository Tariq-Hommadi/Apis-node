import express from 'express';
import pool from '../db.js';
import {authenticateToken} from '../middleware/authorization.js';

let date_ob = new Date();
let date = date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + ("0" + date_ob.getDate()).slice(-2);
let currentTime = date_ob.getHours() + ":" + date_ob.getMinutes();
// let date2 = '2022-03-20'; 
let timeStander = '12:00'
let lastDayTime = '23:59'

const router = express.Router(); 

router.delete('/delete', authenticateToken, async (req,res)=>{
    try {

      if(req.body.start_at < currentTime || req.body.start_at > lastDayTime) return res.json("You can only delete upcoming reservations!")
    // console.log(req.body.start_at, "ddd", currentTime)

      const checkReservation = await pool.query('SELECT * FROM reservation WHERE table_num = $1 AND start_at = $2 AND end_at = $3 AND date = $4', [req.body.table, req.body.start_at, req.body.end_at, date]);

      if(checkReservation.rows.length === 0) return res.json("No reservation with the specified time!")

      const deleteReservation = await pool.query('DELETE FROM reservation WHERE table_num = $1 AND start_at = $2 AND end_at = $3', [req.body.table, req.body.start_at, req.body.end_at]);
      res.json("Deleted successfully!");

    } catch (error) {
      res.status(500).json({error: error.message});
    }
  })
  
  
  export default router;