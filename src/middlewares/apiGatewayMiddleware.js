import { getApiDetailsByApiKeyController } from "../controllers/apikeysController.js";
import { getApiByIdController } from "../controllers/apisController.js";
import { createOrUpdateBillingController } from "../controllers/billingsController.js";
import { createUsageLogController } from "../controllers/usageLogsController.js";

export async function apiGateway(request, response, next) {
  const redirectUrl = request.originalUrl;
  if (!redirectUrl) {
    return response.status(400).json({
      success: false,
      message: "Cannot process your request",
    });
  }

  const { flowcharge } = request.query;
  const api_key = flowcharge;
  if (!api_key) {
    return response.status(400).json({
      success: false,
      message: "Provide a valid api key",
    });
  }
  //getting api key id with the help of provided api key
  const api_key_details = await getApiDetailsByApiKeyController(api_key);
  console.log(api_key_details);
  if (!api_key_details) {
    return response.status(400).json({
      success: false,
      message: "Invalid or Expired API key",
    });
  }
  const api_id = api_key_details.api_id;
  // apis_keys table id associted with the api_id and api_key
  const api_key_id = api_key_details.id;
  const user_id = api_key_details.user_id;
  // getting base url with the extracted api key id
  const base_url = await getApiByIdController(api_id);

  if (!base_url) {
    return response.status(400).json({
      success: false,
      message: "Not able process this url",
    });
  }
  const completeUrl = base_url + redirectUrl;
  const startTime = Date.now();
  const responseFromGeustApi = await fetch(completeUrl, {
    method: "GET",
  });

  const latency = Date.now - startTime;
  const latencyMs = Number.isFinite(latency) ? latency : 0;

  const status = Number(responseFromGeustApi.status) || 0;

  // if error then save the status
  if (!responseFromGeustApi.ok) {
    const logResult = await createUsageLogController(
      api_key_id,
      completeUrl,
      status,
      latencyMs,
    );
    const billings = await createOrUpdateBillingController(user_id, api_id);
    return response.status(200).json({
      success: true,
      gateway: {
        status: status,
        latency: latencyMs,
        timestamp: new Date().toISOString(),
        request: completeUrl,
      },
    });
  }

  const logResult = await createUsageLogController(
    api_key_id,
    completeUrl,
    status,
    latencyMs,
  );
  const billings = await createOrUpdateBillingController(user_id, api_id);
  const data = await responseFromGeustApi.json();
  return response.status(200).json({
    success: true,
    gateway: {
      status: status,
      latency: latencyMs,
      timestamp: new Date().toISOString(),
      request: completeUrl,
    },
    data: data,
  });
}
