import { Pool } from "pg";

// create a connection pool to the database

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// table creation if not exist
export async function initialiseDatabaseTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(10) NOT NULL CHECK (role IN ('admin','owner','consumer')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS apis (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
      creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      base_url VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS apis_keys (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      api_id UUID REFERENCES apis(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      api_key_id UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
      api_key TEXT GENERATED ALWAYS AS ('SD_'  || api_key_id::text) STORED,
      status VARCHAR(10) NOT NULL CHECK (status IN ('active','inactive')) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Database Tables are Initialised");
}
