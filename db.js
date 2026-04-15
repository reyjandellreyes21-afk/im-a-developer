const { Pool } = require("pg");
require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL || "";

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL. Set it in your environment variables.");
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
