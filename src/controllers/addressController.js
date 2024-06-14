const pool = require('../database/connection');

exports.createAddress = async (req, res) => {
  const {
    first_name,
    last_name,
    locality,
    town_city,
    country,
    state,
    postcode_zip,
    mobile,
    email_address,
    address_optional,
    user_id,
  } = req.body;
  const values = [
    first_name,
    last_name,
    locality,
    town_city,
    country,
    state,
    postcode_zip,
    mobile,
    email_address,
    address_optional,
    user_id,
  ];
  try {
    const userResults = await pool.query(
      'SELECT * FROM useraddress WHERE user_id = $1',
      [user_id]
    );
    if (userResults.rows.length >= 5) {
      return res.status(400).json({
        error: 'Not able to add',
        message:
          'Address can be added up to 5. Please delete or modify the existing address',
      });
    }
    await pool.query(
      'INSERT INTO useraddress (first_name, last_name, locality, town_city, country, state, postcode_zip, mobile, email_address, address_optional, user_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      values
    );
    res.status(201).json({
      status: 'success',
      message: 'Address created successfully',
      data: req.body,
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllUserAddresses = async (req, res) => {
  try {
    const userResults = await pool.query('SELECT * FROM useraddress');
    if (userResults.rows.length === 0) {
      return res.status(404).json({ error: 'No addresses found' });
    }
    res.status(200).json({
      status: 'success',
      data: userResults.rows,
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserAddressById = async (req, res) => {
  const { user_id } = req.query;
  try {
    const userResults = await pool.query(
      'SELECT * FROM useraddress WHERE user_id = $1',
      [user_id]
    );
    if (userResults.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json({
      status: 'success',
      data: userResults.rows,
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.deleteUserAddresswithId = async (req, res) => {
  const { user_id } = req.query;
  try {
    const userResults = await pool.query('SELECT * FROM useraddress WHERE user_id = $1', [user_id]);
    if (userResults.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    await pool.query('DELETE FROM useraddress WHERE user_id = $1', [user_id]);
    res.status(200).json({
      status: 'success',
      message: 'User address deleted successfully',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 };
exports.updateUserAddresswithAddressID = async (req, res) => {
  const { user_id, addressid } = req.query;
  const {
    first_name,
    last_name,
    locality,
    town_city,
    country,
    state,
    postcode_zip,
    mobile,
    email_address,
    address_optional,
  } = req.body;
  try {
    const userResults = await pool.query(
      'SELECT * FROM useraddress WHERE user_id = $1 AND addressid = $2',
      [user_id, addressid]
    );
    if (userResults.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    await pool.query(
      'UPDATE useraddress SET first_name=$1, last_name=$2, locality=$3, town_city=$4, country=$5, state=$6, postcode_zip=$7, mobile=$8, email_address=$9, address_optional=$10 WHERE user_id = $11 AND addressid = $12',
      [
        first_name,
        last_name,
        locality,
        town_city,
        country,
        state,
        postcode_zip,
        mobile,
        email_address,
        address_optional,
        user_id,
        addressid,
      ]
    );

    res.status(200).json({
      status: 'success',
      message: 'User address updated successfully',
      data: req.body,
    });
  } catch (error) {
    console.error('Error updating user address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

 exports.getSingleUserAddresswithAddressID = async (req, res) => {
  const { user_id, addressid } = req.query;
  try {
    const userResults = await pool.query('SELECT * FROM useraddress WHERE user_id = $1 AND addressid = $2', [user_id, addressid]);
    if (userResults.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json({
      status: 'success',
      data: userResults.rows,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 };
 exports.deleteUserAddresswithAddressID = async (req, res) => {
  const { user_id, addressid } = req.query;
  try {
    const userResults = await pool.query('SELECT * FROM useraddress WHERE user_id = $1 AND addressid = $2', [user_id, addressid]);
    if (userResults.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    await pool.query('DELETE FROM useraddress WHERE user_id = $1 and addressid =$2', [user_id, addressid]);
    res.status(200).json({
      status: 'success',
      message: 'User address deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
 };
