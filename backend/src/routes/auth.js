import express from 'express';
import bcrypt from 'bcryptjs';
import { query, getOne, insert } from '../utils/db.js';
import { generateToken } from '../utils/generateToken.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const existingUser = await getOne('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = await insert(
      'INSERT INTO users (firstName, lastName, email, phone, password) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, phone || '', hashedPassword]
    );

    const user = await getOne(
      'SELECT id, firstName, lastName, email, phone FROM users WHERE id = ?',
      [userId]
    );

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await getOne('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    delete user.password;

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, phone, address, city, province } = req.body;

    await query(
      `UPDATE users 
       SET firstName = ?, lastName = ?, phone = ?, address = ?, city = ?, province = ?
       WHERE id = ?`,
      [firstName, lastName, phone, address, city, province, req.user.id]
    );

    const user = await getOne(
      'SELECT id, firstName, lastName, email, phone, address, city, province FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;