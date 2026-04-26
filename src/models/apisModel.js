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
