import { pool } from "../configs/db.js";

export async function createApi(
  owner_id,
  name,
  description,
  base_url,
  creator_id,
) {
  try {
    const result = await pool.query(
      `
      INSERT INTO apis (owner_id, creator_id, name, description, base_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
      [owner_id, creator_id, name, description, base_url],
    );
    const api = result.rows[0];

    // removing some informations
    delete api.created_at;
    delete api.updated_at;
    return api;
  } catch (error) {
    throw error;
  }
}

// get apis with its base url
export async function getApiByBaseUrl(base_url) {
  try {
    const result = await pool.query(
      `
      SELECT apis.*, users.name as owner_name 
      FROM apis JOIN users
      ON apis.owner_id =  users.id
      WHERE apis.base_url = $1
     `,
      [base_url],
    );
    const api = result.rows[0];
    if (api) {
      delete api.created_at;
      delete api.updated_at;
    }
    return api;
  } catch (error) {
    throw error;
  }
}

// get all apis
export async function getAllApis() {
  try {
    const result = await pool.query(
      `
      SELECT apis.*, users.name as owner_name 
      FROM apis JOIN users
      ON apis.owner_id =  users.id
     `,
    );
    const apis = result.rows;
    apis.forEach((api) => {
      delete api.created_at;
      delete api.updated_at;
    });

    return apis;
  } catch (error) {
    throw error;
  }
}
