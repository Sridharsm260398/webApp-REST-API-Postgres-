const pool = require('../database/connection');
const bcrypt = require('bcryptjs');
exports.passwordChange = async (req, res) => {
  const { password, old_Pwd } = req.body;
  const { user_id } = req.query;
  try {
   const result=await pool.query('select * from users where user_id = $1', [user_id]);
    if (result.rows.length == 0) {
      return res.status(400).json({ error: 'User not found' });
    }
    const user = result.rows[0];
     const isPasswordMatch = await bcrypt.compare(old_Pwd, user.password);
    if (result.rows.length === 1 && !isPasswordMatch) {
      return res
        .status(400)
        .json({
          error:
            'Current password is incorrect. Please enter the correct password and try again.',
        });
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (isPasswordMatched) {
      return res
        .status(400)
        .json({ error: "New password can't be the same as the current password." });
    }
    if (!isPasswordMatched) {
     const hashPwd = await bcrypt.hash(password, 12);
     await pool.query('update users set password = $1 where user_id=$2', [hashPwd, user_id]);
  
      res.status(200).json({
        status: 'success',
        message: 'Password updated successful!',
      });
    }
  
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}