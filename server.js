import express, {json} from 'express';
import auth from './routes/auth.js';
import reservations from './routes/reservations_list.js';
import available_time from './routes/available_time.js';
import reserve from './routes/reserve.js';
import delete_reservation from './routes/delete_reservation.js';
import cors from 'cors'; 
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { authenticateToken } from './middleware/authorization.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {credentials:true, origin: process.env.URL || '*'};

app.use(cors(corsOptions)); 
app.use(json());
app.use(cookieParser()); 
app.get("/", (req, res) =>{
    res.send("you are in")
})
app.use('/api',auth);

app.use("/api", reservations)

app.use("/api", available_time)

app.use("/api", reserve)

app.use("/api", delete_reservation)

app.listen(PORT, ()=> {
  console.log(`Server is listening on port:${PORT}`);
})