import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { env } from './config/env.js';

dotenv.config();

const DB_CONFIG = {
    host: env.host,
    user: env.user,
    password: env.password,
    database: env.database
};

let connection;

export const getConnection = async () => {
    if (!connection) {
        connection = await mysql.createConnection(DB_CONFIG);
        console.log('Database connection established');
    }
    return connection;
}