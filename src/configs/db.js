import { Pool } from "pg";

// create a connection pool to the database

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Render requires SSL but doesn’t provide CA cert
  },
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
  await pool.query(`
      CREATE TABLE IF NOT EXISTS usage_logs (
      id SERIAL PRIMARY KEY,
      api_key_id UUID REFERENCES apis_keys(id) ON DELETE CASCADE,
      request_point VARCHAR(255) NOT NULL,          
      response_status INT,                     
      latency_ms INT,                         
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await pool.query(`
      CREATE TABLE IF NOT EXISTS billing (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      api_id UUID REFERENCES apis(id) ON DELETE CASCADE,
      total_requests INT DEFAULT 0,
      bill_amount DECIMAL(12,4) DEFAULT 0.00,
      billing_period DATE NOT NULL,
      status VARCHAR(20) CHECK (status IN ('pending','paid')) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT unique_billing UNIQUE (user_id, api_id, billing_period)
    );
  `);
  console.log("Database Tables are Initialised");
}
