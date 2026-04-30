import { pool } from "../configs/db.js";

export async function createApiKey(api_id, user_id) {
  try {
    const result = await pool.query(
      `
      INSERT INTO apis_keys (api_id, user_id)
     VALUES ($1, $2)
     RETURNING *`,
      [api_id, user_id],
    );
    const apiKey = result.rows[0];
    delete apiKey.created_at;
    delete apiKey.updated_at;
    return apiKey;
  } catch (error) {
    console.error("Error creating API key:", error);
    throw error;
  }
}

// Get api key details by api_id and user_id
export async function getApiKeyByApiIdAndUserId(api_id, user_id) {
  try {
    const result = await pool.query(
      `
      SELECT * FROM apis_keys
      WHERE api_id = $1 AND user_id = $2
      `,
      [api_id, user_id],
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching API key:", error);
    throw error;
  }
}
//get api key details with api key
export async function getDetailsByApiKey(api_key) {
  try {
    const result = await pool.query(
      `
      SELECT * FROM apis_keys
      WHERE api_key = $1
      `,
      [api_key],
    );
    const apidetails = result.rows[0];
    delete apidetails.created_at;
    delete apidetails.updated_at;
    return apidetails;
  } catch (error) {}
}
