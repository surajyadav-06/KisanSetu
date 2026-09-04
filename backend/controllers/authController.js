const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, getOne, execute } = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'kisansetu-super-secret-key-2026';

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, mobile, role, location } = req.body;

    if (!full_name || !email || !password || !role || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, password, role, and location.'
      });
    }

    const existing = await getOne('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.'
      });
    }

    const password_hash = await bcrypt.hash(password, 8);
    const result = await execute(
      `INSERT INTO users (full_name, email, password_hash, mobile, role, location)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [full_name, email, password_hash, mobile || '', role, location]
    );

    const user = await getOne('SELECT id, full_name, email, mobile, role, location, avatar FROM users WHERE id = ?', [result.lastID]);
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user account. Please try again.'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password.'
      });
    }

    const user = await getOne('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const safeUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      location: user.location,
      avatar: user.avatar
    };

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      message: `Welcome back, ${user.full_name}!`,
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed due to a server error.'
    });
  }
};

exports.getDemoUsers = async (req, res) => {
  try {
    const users = await query('SELECT id, full_name, email, role, location, avatar FROM users ORDER BY id ASC');
    return res.json({
      success: true,
      users
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load demo accounts' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No authorization token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await getOne('SELECT id, full_name, email, mobile, role, location, avatar FROM users WHERE id = ?', [decoded.id]);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token' });
  }
};
