import * as UsageLogs from "../models/usagelogsModel.js";

// Api key creation controller, data comming from middle ware
export async function createUsageLogController(
  api_key_id,
  completeUrl,
  response_status,
  latency_ms,
) {
  try {
    const usageLog = await UsageLogs.createUsageLogs(
      api_key_id,
      completeUrl,
      response_status,
      latency_ms,
    );
    return usageLog;
  } catch (error) {
    console.error("Error creating usage log:", error);
  }
}
