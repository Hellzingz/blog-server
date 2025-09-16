import dotenv from 'dotenv'
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;

// ตรวจสอบ environment variables
if (!process.env.POSTGRESQL_URI) {
  console.error('Error: POSTGRESQL_URI environment variable is not set');
  process.exit(1);
}

const connectionPool = new Pool({
  connectionString: process.env.POSTGRESQL_URI,
});

// ตรวจสอบการเชื่อมต่อฐานข้อมูล
connectionPool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

connectionPool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

export default connectionPool;
