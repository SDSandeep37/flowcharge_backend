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

// get usage log details with the help of api_id and user id
export async function getUsageLogsByApiID(api_id, user_id) {
  try {
    const query = `SELECT  apis.id as apiId,apis.name,apis_keys.status as staus_of_key, usage_logs.response_status,
      usage_logs.latency_ms,usage_logs.id FROM apis  
      JOIN apis_keys ON apis.id = apis_keys.api_id
      JOIN usage_logs ON apis_keys.id =  usage_logs.api_key_id
      WHERE apis.id = $1
      AND apis_keys.user_id = $2`;

    const result = await pool.query(query, [api_id, user_id]);
    const usageLogs = result.rows;

    usageLogs.forEach((item) => {
      delete item.created_at;
      delete item.updated_at;
      delete item.creator_id;
      delete item.owner_id;
    });

    return usageLogs;
  } catch (error) {
    console.log("Error while getting the log details", error);
    return false;
  }
}
