const pool = require('../database/connection');
exports.getCreditDebit = async (req, res) => {
 try {
   const { rows } = await pool.query('SELECT * FROM savedcards');
   res.status(200).json({
     status: 'Success',
     result: rows.length,
     data: rows,
   });
 } catch (err) {
   res.status(500).json({ message: 'Internal Server Error' });
 }
};
exports.getCreditDebitWithID = async (req, res) => {
 const { user_id } = req.query;
 try {
   const { rows } = await pool.query('SELECT * from  savedcards WHERE user_id = $1', [user_id]);
   if (rows.length === 0) {
     return res.status(400).json({ error: 'Card not found for User' });
   }
   res.status(200).json({
     status: "success",
     message: 'Card fetched successful!',
     data: rows,
   });
 } catch (err) {
   res.status(500).json({ message: 'Internal Server Error' });
 }
};
exports.deleteCreditDebitWithCID = async (req, res) => {
 const { card_id, user_id } = req.query;
 try {
   const userResults = await pool.query('SELECT * FROM savedcards where user_id =$1 and card_id =$2', [user_id, card_id]);
   if (userResults.rows.length === 0) {
     return res.status(404).json({ error: 'Card not found' });
   }
   await pool.query('DELETE from savedcards where user_id =$1 and card_id =$2', [user_id, card_id]);
   res.status(200).json({
     status: "success",
     message: 'Card deleted successful!',
   });
 } catch (err) {
   res.status(500).json({ message: 'Internal Server Error' });
 }
};
exports.addCreditDebit = async (req, res) => {
 const { card_holder_name, card_number, cvv, expiry_date, user_id } = req.body;
 try {
   const userResults = await pool.query('SELECT * FROM savedcards where user_id = $1', [user_id]);
   if (userResults.rows.length >= 5) {
     return res.status(400).json({
       error: 'Not able to add',
       message: 'Cards can be added up to 5. Please delete the existing cards and try to add.',
     });
   }
   const emailResults = await pool.query('SELECT * FROM savedcards WHERE card_number = $1', [card_number]);
   if (emailResults.rows.length > 0) {
     return res.status(400).json({ error: 'Card number already exists' });
   }
   const values = [card_holder_name, card_number, cvv, expiry_date, user_id];
   await pool.query(
     'INSERT INTO savedcards ( card_holder_name ,card_number , cvv,  expiry_date ,user_id) VALUES($1,$2,$3,$4,$5)',
     values
   );
   res.status(201).json({
     status: 'success',
     message: 'Card added successfully',
     data: req.body,
   });
 } catch (error) {
  console.error('Error adding Card:', error);
  if(error.constraint =='savedcards_card_number_check'){
    error.message ='Entre correct Card Number, format Number:{XXXXXXXXXXX12} Size:12 digit';
  }
  else if(error.constraint =='savedcards_cvv_check'){
    error.message ='Entre correct Card CVV, format Number:{XXX} ';
  }
 else if(error.constraint =='savedcards_expiry_date_check'){
    error.message ='Entre correct Card Expiry Date, format Number:{MM/YY} ';
  }else{
    error.message = 'Internal Server Error' ;
  }
   res.status(500).json({ message: `${error.message}`});
   //res.status(500).json({ message: 'Internal Server Error' });
 }
};