const pool = require('../database/connection');
const fs = require('fs');
const path = require('path');
async function uploadPhoto(req, res) {
  try {
    const userId = req.body.userId;

    const photoPath = req.file.path;

    const query = 'UPDATE users SET profile_photo = $1 WHERE user_id = $2';

    await pool.query(query, [photoPath, userId]);

    res.status(200).json({ message: 'Photo uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getPhoto(req, res) {
  try {
    const userId = req.params.userId;

    const query = 'SELECT profile_photo FROM users WHERE user_id = $1';

    const result = await pool.query(query, [userId]);

    if (result.rows.length > 0 && result.rows[0].profile_photo) {
      res.sendFile(path.resolve(result.rows[0].profile_photo));
    } else {
      res.status(404).json({ message: 'Photo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deletePhoto(req, res) {
  try {
    const userId = req.params.userId;

    const query = 'SELECT profile_photo FROM users WHERE user_id = $1';

    const result = await pool.query(query, [userId]);

    if (result.rows.length > 0 && result.rows[0].profile_photo) {
      fs.unlinkSync(result.rows[0].profile_photo);

      const updateQuery = 'UPDATE users SET profile_photo = NULL WHERE user_id = $1';

      await pool.query(updateQuery, [userId]);

      res.status(200).json({ message: 'Photo deleted successfully' });
    } else {
      res.status(404).json({ message: 'Photo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { uploadPhoto, getPhoto, deletePhoto };
