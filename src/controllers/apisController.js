import * as Apis from "../models/apisModel.js";
import { urlValidator } from "../utils/validations.js";

export async function createApiController(request, response) {
  if (!request.body) {
    return response.status(400).json({
      success: false,
      message: "Api data required",
    });
  }
  if (!request.user) {
    return response.status(401).json({
      success: false,
      message: "Unauthorized request",
    });
  }
  const { user, userrole } = request.user;
  // console.log("User ID:", user); // Debugging line to check the user ID value
  // console.log("User Role:", userrole); // Debugging line to check the role value
  if (userrole !== "owner" && userrole !== "admin") {
    return response.status(403).json({
      success: false,
      message: "Only owner or admin can create api",
    });
  }

  const { name, description, base_url } = request.body;
  let owner_id;
  if (userrole === "owner") {
    owner_id = user; // Set owner_id to the user's ID if they are an owner
  } else if (userrole === "admin") {
    owner_id = request.body.owner_id; // Admin must provide owner_id in the request body
  }
  // console.log("Owner ID:", owner_id); // Debugging line to check the owner_id value
  if (!owner_id) {
    return response.status(400).json({
      success: false,
      message: "Owner Id is required",
    });
  }
  if (!name) {
    return response.status(400).json({
      success: false,
      message: "Api name is required",
    });
  }
  if (!description) {
    return response.status(400).json({
      success: false,
      message: "Api description is required",
    });
  }
  if (!base_url) {
    return response.status(400).json({
      success: false,
      message: "Api base URL is required",
    });
  }
  if (!urlValidator(base_url)) {
    return response.status(400).json({
      success: false,
      message: "Invalid Api base URL",
    });
  }
  const existingApi = await Apis.getApiByBaseUrl(base_url);
  if (existingApi) {
    return response.status(409).json({
      success: false,
      message: "Api with this base URL already exists",
    });
  }

  try {
    const api = await Apis.createApi(
      owner_id,
      name,
      description,
      base_url,
      user, // Pass the creator's user ID
    );
    return response.status(201).json({
      success: true,
      message: "Api created successfully",
      data: api,
    });
  } catch (error) {
    console.error("Create Api failed:", error);
    return response.status(500).json({
      success: false,
      message: "Some went wrong. Please try again!",
    });
  }
}

// get all apis controller
export async function getAllApisController(request, response) {
  try {
    const apis = await Apis.getAllApis();
    return response.status(200).json({
      success: true,
      message: "Apis retrieved successfully",
      apis: apis,
    });
  } catch (error) {
    console.error("Get All Apis failed:", error);
    return response.status(500).json({
      success: false,
      message: "Some went wrong. Please try again!",
    });
  }
}

//get api with it's base url
export async function getApiWithBaseUrlController(request, response) {
  const { base_url } = request.body;
  if (!base_url) {
    return response.status(400).json({
      success: false,
      message: "Api base URL is required",
    });
  }
  try {
    const api = await Apis.getApiByBaseUrl(base_url);
    if (!api) {
      return response.status(404).json({
        success: false,
        message: "Api not found",
      });
    }
    return response.status(200).json({
      success: true,
      message: "Api retrieved successfully",
      data: api,
    });
  } catch (error) {
    console.error("Get Api by Base URL failed:", error);
    return response.status(500).json({
      success: false,
      message: "Some went wrong. Please try again!",
    });
  }
}
