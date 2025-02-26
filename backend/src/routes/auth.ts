import express, { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';
import dotenv from 'dotenv';

dotenv.config();
const router: Router = express.Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.status(201).json({ token });
  } catch (err: any) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'Username already exists' });
    } else {
      console.error('Registration failed:', err);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;
    try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (result.rows.length === 0) {
        res.status(400).json({ error: 'Invalid credentials' });
        return;
      }

      const user = result.rows[0];
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { id: user.id, username: user.username }, 
          process.env.JWT_SECRET || 'secret',
          { expiresIn: '1h' }
        );
        res.json({ token });
      } else {
        res.status(400).json({ error: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('Login failed:', err);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);
  
export default router;
