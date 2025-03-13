import { Pool } from 'pg';
import oracledb from 'oracledb';
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL
export const pgPool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: 5432,
  max: 10, 
  connectionTimeoutMillis: 10000, 

});

// OracleDB
export const oraclePool = oracledb.createPool({
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING,
});

// SQL Server
export const sqlServerPool = new sql.ConnectionPool({
  user: process.env.SQL_USER || 'defaultUser',
  password: process.env.SQL_PASSWORD || 'defaultPassword',
  server: process.env.SQL_SERVER || 'defaultServer',
  database: process.env.SQL_DATABASE || 'defaultDatabase',
  options: {
    encrypt: false,
  },
});
