const { Sequelize } = require('sequelize');
if (!process.env.VERCEL) require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

let dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL;

let dbName = process.env.POSTGRES_DATABASE || process.env.DB_NAME || 'postgres';
let dbUser = process.env.POSTGRES_USER || process.env.DB_USER || 'postgres';
let dbPassword = process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || '';
let dbHost = process.env.POSTGRES_HOST || process.env.DB_HOST || '127.0.0.1';
let dbPort = process.env.POSTGRES_PORT || process.env.DB_PORT || 5432;

if (dbUrl) {
  try {
    const parsed = new URL(dbUrl);
    if (parsed.pathname && parsed.pathname.length > 1) dbName = parsed.pathname.replace('/', '');
    if (parsed.username) dbUser = decodeURIComponent(parsed.username);
    if (parsed.password) dbPassword = decodeURIComponent(parsed.password);
    if (parsed.hostname) dbHost = parsed.hostname;
    if (parsed.port) dbPort = parsed.port;
  } catch (e) {
    console.error('Failed to parse database URL:', e);
  }
}

if (dbHost.includes('pooler.supabase.com') && String(dbPort) === '6543') {
  dbPort = 5432;
}

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
const useSSL = isProduction || process.env.DB_SSL === 'true' || !!dbUrl;

const dialectOptions = useSSL
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : {};

const sequelize = new Sequelize(dbName, dbUser, String(dbPassword), {
  host: dbHost,
  port: parseInt(dbPort),
  dialect: 'postgres',
  dialectOptions,
  logging: false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
});

module.exports = sequelize;
