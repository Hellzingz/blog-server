import dotenv from 'dotenv'
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;


const connectionPool = new Pool({
  connectionString: process.env.POSTGRESQL_URI,
});

export default connectionPool;
