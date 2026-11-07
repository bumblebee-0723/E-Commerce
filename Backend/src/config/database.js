import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || 'Charan@2008';
const dbName = process.env.DB_NAME || 'mycompany';
const dbDialect = process.env.DB_DIALECT || 'mysql';

let sequelize;

if (dbDialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
  });
} else {
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: false,
      freezeTableName: true,
    },
  });
}

/**
 * Initializes database: ensures MySQL database exists, tests connection, and syncs tables.
 */
export async function initDatabase() {
  if (dbDialect === 'mysql') {
    try {
      const connection = await mysql.createConnection({
        host: dbHost,
        port: dbPort,
        user: dbUser,
        password: dbPassword,
      });
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
      await connection.end();
    } catch (err) {
      console.warn(`[Database Warning] Could not auto-create database "${dbName}": ${err.message}`);
    }
  }

  await sequelize.authenticate();
  console.log(`[Database] Connected to ${dbDialect.toUpperCase()} database: ${dbName}`);
  
  // Sync tables (equivalent to spring.jpa.hibernate.ddl-auto=update)
  await sequelize.sync({ alter: true });
  console.log('[Database] Schema synchronized successfully.');
}

export default sequelize;
