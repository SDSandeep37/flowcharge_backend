import * as ApiKeys from "../models/apikeysModel.js";

// Api key creation controller
export async function createApiKeyController(request, response) {
  if (!request.body) {
    return response.status(400).json({
      success: false,
      message: "Request details is missing",
    });
  }
  const { api_id } = request.body;
  const user_id = request.user.user; // The authenticated user's ID is stored in request.user.user
  // console.log("Creating API key for API ID:", api_id, "and User ID:", user_id);
  const existingApiKey = await ApiKeys.getApiKeyByApiIdAndUserId(
    api_id,
    user_id,
  );
  if (existingApiKey) {
    return response.status(400).json({
      success: false,
      message: "API key already exists for this API and user",
    });
  }

  try {
    const apiKey = await ApiKeys.createApiKey(api_id, user_id);
    response.status(201).json({
      success: true,
      apiKey: apiKey,
    });
  } catch (error) {
    console.error("Error creating API key:", error);
    response.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
