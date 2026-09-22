import fs from 'node:fs';
import mysql from 'mysql2/promise';
import { env } from './config/env.js';

let pool;

const buildSslConfig = () => {
    if (!env.db.ssl) {
        return undefined;
    }

    if (env.db.sslCa) {
        return {
            ca: env.db.sslCa.replaceAll('\\n', '\n'),
            rejectUnauthorized: true,
        };
    }

    if (env.db.sslCaPath) {
        return {
            ca: fs.readFileSync(env.db.sslCaPath, 'utf8'),
            rejectUnauthorized: true,
        };
    }

    return {
        rejectUnauthorized: env.db.sslRejectUnauthorized,
    };
};

export const getConnection = async () => {
    if (!pool) {
        if (!env.db.host || !env.db.user || !env.db.database) {
            throw new Error('Set DB_HOST, DB_USER, and DB_NAME in the backend environment variables.');
        }
        if (!Number.isInteger(env.db.port) || env.db.port < 1 || env.db.port > 65535) {
            throw new Error('DB_PORT must be an integer between 1 and 65535.');
        }

        pool = mysql.createPool({
            host: env.db.host,
            port: env.db.port,
            user: env.db.user,
            password: env.db.password,
            database: env.db.database,
            ssl: buildSslConfig(),
            waitForConnections: true,
            connectionLimit: 10,
            connectTimeout: 10000,
        });
    }

    return pool;
};
