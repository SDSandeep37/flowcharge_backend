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

// get usage log details by its api_id and user_id
export async function getLogsByApiAndUserIdController(request, response) {
  if (!request.params) {
    return response.status(400).json({
      success: false,
      message: "Missing required details to fetch log details",
    });
  }

  const { api_id } = request.params;
  const { user } = request.user;
  try {
    const usageLogDetails = await UsageLogs.getUsageLogsByApiID(api_id, user);

    if (!usageLogDetails) {
      return response.status(500).json({
        success: false,
        message: "Something went wrong,Not able to fetch the log details.",
      });
    }
    if (usageLogDetails.length === 0) {
      return response.json({
        success: true,
        message: "Usages log detalis not found.",
      });
    }

    return response.json({
      success: true,
      data: usageLogDetails,
    });
  } catch (error) {}
}
