import { pool } from "../configs/db.js";

//insert if not and update if exist
export async function upsertBilling({ userId, apiId, costPerRequest }) {
  try {
    // const billingPeriod = new Date().toLocaleString("default", {
    //   month: "short",
    //   year: "numeric",
    // });
    // const billingPeriod = new Date().toISOString().slice(0, 7);
    const billingPeriod = new Date().toISOString().slice(0, 7) + "-01";
    // "2026-05-01"
    const query = `
      INSERT INTO billing (user_id, api_id, billing_period, total_requests, bill_amount,created_at,updated_at)
      VALUES ($1, $2, $3, 1, $4,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, api_id, billing_period)
      DO UPDATE SET
        total_requests = billing.total_requests + 1,
        bill_amount = billing.bill_amount + EXCLUDED.bill_amount,
        updated_at = CURRENT_TIMESTAMP;
    `;

    await pool.query(query, [userId, apiId, billingPeriod, costPerRequest]);
    return { success: true };
  } catch (error) {
    console.error("Error upserting billing:", error);
    return { success: false, error: error.message };
  }
}

// get billing details with the help of api_id and user id
// export async function getBillingDetailsByApiID(api_id, user_id) {
//   try {
//     const query = `SELECT  billing.*, apis.name as api_name, apis_keys.status as status_of_key,
//     usage_logs.response_status,usage_logs.latency_ms FROM billing
//     JOIN apis ON billing.api_id =  apis.id
//     JOIN apis_keys ON apis.id = apis_keys.api_id
//     JOIN usage_logs ON apis_keys.id =  usage_logs.api_key_id
//     WHERE billing.api_id = $1
//     AND billing.user_id = $2`;

//     const result = await pool.query(query, [api_id, user_id]);
//     const billingDetails = result.rows;

//     billingDetails.forEach((item) => {
//       delete item.created_at;
//       delete item.updated_at;
//     });

//     return billingDetails;
//   } catch (error) {
//     console.log("Error while getting the billing details", error);
//     return false;
//   }
// }
// get billing details with the help of api_id and user id
export async function getBillingDetailsByApiID(api_id, user_id) {
  try {
    const query = `SELECT  * FROM billing
      WHERE api_id = $1
      AND  user_id = $2 LIMIT 1`;

    const result = await pool.query(query, [api_id, user_id]);
    const billingDetails = result.rows[0];

    delete billingDetails.created_at;
    delete billingDetails.updated_at;

    return billingDetails;
  } catch (error) {
    console.log("Error while getting the billing details", error);
    return false;
  }
}
