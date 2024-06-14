const app = require('../app');
const dotenv = require('dotenv');
dotenv.config({ path: './src/config.env' })
console.log(process.env.NODE_ENV);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
