const pool = require('../database/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const results = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (results.rows.length === 0) {
      console.log('Invalid email or password:', email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }
   const user = results.rows[0];
     const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      console.log('Invalid email or password:', email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    console.log('User logged in successfully:', email);
    const token = jwt.sign({ userID: user.user_id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_SESSION_EXPIRE,
    });
    res.status(200).json({
      token: token,
      expiresIn:3600,
      status: 'success',
      message: 'User logged in successfully',
      data: { id: user.user_id },
    });
  } catch (error) {
    console.error('Error checking user credentials:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};