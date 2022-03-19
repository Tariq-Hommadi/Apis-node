// const Pool = require('pg').Pool

// const pool =  new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "restaurant",
//     password: "1234",
//     port: "5432"
// })

// module.exports = pool

import pg from 'pg';
const { Pool } = pg;

let localPoolConfig = {
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: '5432',
  database: "restaurant",
};

const poolConfig = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
} : localPoolConfig;

const pool = new Pool(poolConfig);
export default pool;