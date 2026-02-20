import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../Database/pg.js';

  export const signup = async (req, res) => {
    try {
      const { username:name, email, password } = req.body;

      // Check existing user
      const userExist = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (userExist.rows.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const newUser = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id, email",
        [name, email, hashedPassword]
      );

      // Generate token
      const token = jwt.sign(
        { id: newUser.rows[0].id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(201).json({
        message: "User registered successfully",
        token,
        success:true
      });


    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log(token);
    console.log(user);
    
    

    res.status(200).json({
      message: "Login successful",
      token,
      user: user.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
