const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Store',
    password: 'sridharsm@26',
    port: 5432, 
   });

   module.exports =pool