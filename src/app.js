const fs = require('fs');
/* const url = require('url');
const http = require('http'); */
const cors = require('cors');
//const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
//const mysql = require('mysql')
const pool = require('./database/connection');
const express = require('express');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const userRoute = require('./routes/userRoutes');
const addressRoute = require('./routes/addressRoutes');
const loginRoute = require('./routes/loginRoutes');
const signupRoute = require('./routes/signupRoutes');
const paymentRoute = require('./routes/paymentRoutes');
const productRoute = require('./routes/productRoutes');
const passwordChangeRoute = require('./routes/passwordRoutes');
const invoiceRoute = require('./routes/invoiceRoutes');
const profileRoute = require('./routes/profileRoutes');
const bcrypt = require('bcryptjs');
const path = require('path');
const { get } = require('https');
const { stat } = require('fs');
const { error } = require('console');
const { STATUS_CODES } = require('http');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const app = express();
app.use(cors());
app.use(express.json());
//app.use(morgon.json());
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../src`));
app.use(express.static('uploads'));
const swaggerOptions = {
  swaggerOptions: {
    authAction: {
      bearerAuth: {
        name: 'bearerAuth',
        schema: {
          type: 'http',
          in: 'header',
          name: 'Authorization',
          description: '',
        },
        value: 'Bearer <JWT>',
      },
    },
  },
};
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);
app.use((req, res, next) => {
  console.log("Welcom to Sridhar's REST API WebApp S-cart!");
  next();
});
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization,Scart,Lang,Website,AuthCode,UserId,App-Mode'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
/* const pool = mysql.createpool({
  host: 'localhost',
  user: 'root',
  password: 'Shreyas@1998',
  database: 'store'
}); */
app.use((req, res, next) => {
  req.requestedDate = new Date().toISOString();
  console.log(req.requestedDate);
  next();
});
/* app.get('/fetch-products', async (req, res) => {
  try {
    const checkQuery = 'SELECT COUNT(*) AS count FROM products';
    pool.query(checkQuery, async (err, results) => {
      if (err) {
        console.error('Error checking products:', err);
        res.status(500).send('Error checking products in database');
        return;
      }
      const productCount = results.rows[0].count;
      if (productCount > 0) {
        res.status(200).send('Products already exist in the database');
        return;
      }
      const response = await fs.readFile(
        `${__dirname}/data/data.json`,
        'utf-8'
      );
      const products = JSON.parse(response);

      const values= products.map((p) => [
        p.id,
        p.title,
        p.price,
        p.description,
        p.category,
        p.image,
        p.rating.rate,
        p.rating.count,
      ]);
      const insertQuery = ` `;
      for (const value of values) {
        pool.query(
          'INSERT INTO products (id, title, price, description, category, image, rate, count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ',
          value,
          (err, result) => {
            if (err) {
              console.error('Error inserting products:', err);
              res.status(500).send('Error fetching and saving products');
              return;
            }
            res.status(200).send('Products fetched and saved to database');
          }
        );
      }
   
    });
  } catch (error) {
    res.status(500).send('Error fetching products from API');
  }
}); */
app.get('/fetch-products', async (req, res) => {
  try {
    const checkQuery = 'SELECT COUNT(*) AS count FROM products_1';
    const { rows } = await pool.query(checkQuery);
    const productCount = rows[0].count;
    if (productCount > 0) {
      res.status(200).send('Products already exist in the database');
      return;
    }
    const response = await fs.readFile(`${__dirname}/data/data.json`, 'utf-8');
    const products = JSON.parse(response);
    const values = products.map((p) => [
      p.id,
      p.title,
      p.price,
      p.description,
      p.category,
      p.image,
      p.rating.rate,
      p.rating.count,
    ]);
    /*    const values = products.map(p => [
      p.id ,
      p.title,
      p.description,
      p.price,
      p.discountPercentage,
      p.rating,
      p.stock,
      p.brand,
      p.category,
      p.thumbnail,
      p.image,
	     ]); */
    for (const value of values) {
      await pool.query(
        'INSERT INTO products (id, title, price, description, category, image, rate, count) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)',
        value
      );
      //  await pool.query('INSERT INTO products_1(id,title,description,price,discount_percentage,rating,stock,brand,category,thumbnail,image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10,$11)', value);
    }
    res.status(200).send('Products fetched and saved to database');
  } catch (error) {
    console.error('Error fetching products:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).send(`Error fetching products: ${error.message}`);
  }
});
//created the middleware
app.use('/api/v1/users', signupRoute);
app.use('/api/v1/users', loginRoute);
app.use('/api/v1/users', paymentRoute);
app.use('/api/v1/users/address', addressRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', passwordChangeRoute);
app.use('/api/v1/users', invoiceRoute);
app.use('/profile', profileRoute);
app.all('*', (req, res, next) => {
  return res.status(404).json({
    error: {
      errMessageList: {
        errorCode: 404,
        status: 'Fail',
        message: `Can't find the ${req.originalUrl} on this server`,
      },
    },
  });
});
// userRoute.route('/creditdebit').post(addCreditDebit).get(getCreditDebit);
// addressRoute.route('/').post(createaddress).get(getALLUserAddress);
// addressRoute.route('/:id').get(getSingleUserAddress).delete(deleteUserAddresswithId);
// addressRoute.route('/:id/:addressid').get(getSingleUserAddresswithAddressID).delete(deleteUserAddresswithAddressID)
// userRoute.route('/profile').post(createProfile);
// userRoute.route('').get(getAllUser);
// userRoute.route('/signup').post(singupUser);
// userRoute.route('/login').post(loginUser);
// userRoute.route('/:id').get(getSingleUser).delete(deleteUser).patch(updateUserProfile)
// app.route('/api/v1/users/creditdebit').post(addCreditDebit).get(getCreditDebit);
// app.route('/api/v1/users/address').post(createaddress).get(getALLUserAddress);
// app.route('/api/v1/users/address/:id').get(getSingleUserAddress).delete(deleteUserAddresswithId);
// app.route('/api/v1/users/address/:id/:addressid').get(getSingleUserAddresswithAddressID).delete(deleteUserAddresswithAddressID)
// app.route('/api/v1/users/profile').post(createProfile);
// app.route('/api/v1/users').get(getAllUser);
// app.route('/api/v1/users/signup').post(singupUser);
// app.route('/api/v1/users/login').post(loginUser);
// app.route('/api/v1/users/:id').get(getSingleUser).delete(deleteUser).patch(updateUserProfile)

// app.get('/api/v1/users', getallTours);
// app.post('/api/v1/users', createTour);
// app.get('/api/v1/users/:id', getTour);
// app.patch('/api/v1/users/:id', updateTour);
// app.delete('/api/v1/users/:id', deleteTour);
module.exports = app;
