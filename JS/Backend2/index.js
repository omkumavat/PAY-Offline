import express from "express";
import pool from "./Database/pg.js";
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors({
  origin: '*',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowing these methods
  allowedHeaders: ['Content-Type'], // Allow these headers
}));


import User from './Routes/User.js';
app.use('/server',User);


app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


app.listen(4000, () => {
  console.log("app is listening on port 4000");
});
// // export default app;
