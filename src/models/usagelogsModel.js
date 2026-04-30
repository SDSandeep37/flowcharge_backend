import { pool } from "../configs/db.js";

export async function createUsageLogs(
  api_key_id,
  completeUrl,
  response_status,
  latency_ms,
) {
  try {
    const result = await pool.query(
      `
      INSERT INTO usage_logs (api_key_id, request_point,response_status,latency_ms)
      VALUES ($1, $2, $3,$4)
      RETURNING *`,
      [api_key_id, completeUrl, response_status, latency_ms],
    );

    const usageLogs = result.rows[0];
    delete usageLogs.created_at;
    return usageLogs;
  } catch (error) {
    console.error("Error creating usage logs:", error);
    throw error;
  }
}
