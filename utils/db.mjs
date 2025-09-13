import pkg from "pg";
const { Pool } = pkg;
import dotenv from 'dotenv'
dotenv.config();

const connectionPool = new Pool({
  connectionString: process.env.POSTGRESQL_URI,
});

export default connectionPool;
