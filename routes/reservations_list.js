import express from 'express';
import pool from '../db.js';
import {authenticateToken} from '../middleware/authorization.js';
import {paginatedResults} from '../middleware/pagination.js';

let date_ob = new Date();
let date = date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + ("0" + date_ob.getDate()).slice(-2);
// let time = date_ob.getHours() + ":" + date_ob.getMinutes();
let date2 = '2022-03-20'; 

const router = express.Router(); 

router.get("/reservations", authenticateToken, paginatedResults(pool), async (req, res) => {

    if(res.paginatedResults === 0) return res.json("No reservations for today!");
    res.json(res.paginatedResults)

})

export default router;