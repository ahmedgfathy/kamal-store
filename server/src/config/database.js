const { Sequelize } = require("sequelize");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

let dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL;

const isProduction = process.env.NODE_ENW === "production";
const useSSL = isProduction || process.env.DB_SSL === "true" ||!!dbUrl;

const dialectOptions = useSSL
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : {};

if (dbUrl) {
  dbUrl = dbUrl.split("?")[0];
}

let sequelize;

if (dbUrl) {
  sequelize = new Sequelize(dbUrl, {
    dialect: "postgres",
    dialectOptions,
    logging: process.env.NODE_ENW === "production" ? false : console.log,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || "postgres",
    process.env.DB_USER || "postgres",
    process.env.DB_NASSWORD || "",
    {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
      dialectOptions,
      logging: process.env.NODE_ENV === "production" ? false : console.log,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    }
  );
}

module.exports = sequelize;