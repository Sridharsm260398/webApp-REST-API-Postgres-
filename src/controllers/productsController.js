const pool = require('../database/connection');

/* exports.getallProducts = (req, res) => {
  pool.query('Select * from products', (err, result) => {
    if (err) {
      console.error('Error fetching Products:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

  res.status(200).json({
    status: 'success',
    message: 'Products fetched successfull!',
    data:result.rows,
  });
})
}; */

exports.getallProducts = async (req, res) => {
  try {
    const currentPage = +req.query.page || 1;
    const pageSize = +req.query.pageSize || 10;
    const offset = (currentPage-1)* pageSize;
    const filter = req.query.filter ;
    const query = `
    SELECT * FROM products
    WHERE (title ILIKE $1 or category ILIKE $2)
    ORDER BY id
    LIMIT $3 OFFSET $4
  `;
  const countQuery = `
    SELECT COUNT(*) AS count  FROM products
    WHERE(title ILIKE $1 or category ILIKE $2) 
  `;
  const values = [`%${filter}%`,`${filter}%`, pageSize, offset];
  const countValues = [`%${filter}%`,`${filter}%`];
    // const result = await pool.query('Select * from products where title ILIKE $1 ORDER BY id LIMIT $2 OFFSET $3 ',[pageSize,offset]);
    // const { rows } = await pool.query('SELECT COUNT(*) AS count FROM products')
  
    const result = await pool.query(query, values);
    const { rows } = await pool.query(countQuery, countValues);
    console.log(rows[0].count)
    res.status(200).json({
      currentPage,
      pageSize,
      totalElements:rows[0].count,
      status: 'success',
      message: 'Products fetched successfull!',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching Products:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.addItemstoCart = (req, res) => {
  const {
    id,  
   title,
   price ,
   description,
   category ,
   image,
   rate,
   count
  } = req.body;
  const values = [
    id,  
    title,
    price ,
    description,
    category ,
    image,
    rate,
    count
  ];
  pool.query(
    'INSERT INTO cart (id,title,price,description,category,image,rate,count) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',
    values,
    (err, result) => {
      if (err) {
        console.error('Error adding cart:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({
        status: 'success',
        message: 'Item added to cart Successfully',
        data: req.body,
      });
    }
  );
};
