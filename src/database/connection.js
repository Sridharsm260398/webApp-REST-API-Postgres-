const { Pool } = require('pg');

   const pool = new Pool({
    user: 'sridharpostgres',
    host: 'sridarswebapppostgresscomplient.postgres.database.azure.com',
    database: 'postgres',
    password: 'Postgres@2225146',
    port: 5432,
     ssl: {
    rejectUnauthorized: false
  }
   });
   module.exports =pool