import * as Billings from "../models/billingModel.js";

export async function createOrUpdateBillingController(userId, apiId) {
  try {
    const costPerRequest = 0.1; // price in rupees

    const result = await Billings.upsertBilling({
      userId,
      apiId,
      costPerRequest,
    });

    if (!result.success) {
      console.error("Billing update failed");
    }

    return result.success;
  } catch (error) {
    console.error("Error while updating billings ", error);
  }
}

//above operation can also be done as this

// export async function createOrUpdateBilling(req, res) {
//   try {
//     const { userId, apiId } = req.body; // middleware should pass these
//     const costPerRequest = 0.01; // example pricing per request

//     const result = await upsertBilling({ userId, apiId, costPerRequest });

//     if (!result.success) {
//       return res.status(500).json({ error: "Billing update failed", details: result.error });
//     }

//     res.json({ message: "Billing updated successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Controller error", details: err.message });
//   }
// }

// get billing details by its api_id and user_id
export async function getBillingsByApiAndUserIdController(request, response) {
  if (!request.params) {
    return response.status(400).json({
      success: false,
      message: "Missing required details to fetch billing details",
    });
  }

  const { api_id } = request.params;
  const { user } = request.user;
  try {
    const billingDetails = await Billings.getBillingDetailsByApiID(
      api_id,
      user,
    );

    if (!billingDetails) {
      return response.status(500).json({
        success: false,
        message: "Something went wrong,Not able to fetch the billing details.",
      });
    }
    if (billingDetails.length === 0) {
      return response.json({
        success: true,
        message: "Billing detalis not found.",
      });
    }

    return response.json({
      success: true,
      data: billingDetails,
    });
  } catch (error) {}
}
