import stripe from "../configs/stripe.js";
import * as Payments from "../models/paymentModel.js";

export const createCheckoutSession = async (request, response) => {
  if (!request.body) {
    return response.status(400).json({
      success: false,
      message: "Missing some details to process the payment",
    });
  }
  try {
    const { billingId } = request.body;
    const { user, email } = request.user; //getting from jwt auth

    //get bill details
    const bill = await Payments.getBillingByBillingId(billingId);
    if (!bill) {
      return response.status(404).json({
        success: false,
        message: "Billing not found",
      });
    }
    //Prevent duplicate payments
    if (bill.status === "paid") {
      return response.status(400).json({
        success: false,
        message: "Already paid",
      });
    }

    // Convert amount → paise (Stripe needs smallest unit)
    const amount = Math.round(bill.bill_amount * 100);

    // 3 Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "API Usage Billing",
              description: `API ID: ${bill.api_id}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        billing_id: bill.id,
        user_id: user_id,
      },
      success_url: `https://flowcharge.vercel.app/success`,
      cancel_url: `https://flowcharge.vercel.app/cancel`,
    });

    // Store payment in DB
    await Payments.createPayment({
      billing_id: bill.id,
      user_id: user,
      stripe_session_id: session.id,
      amount: bill.bill_amount,
      currency: "inr",
    });

    // Return Stripe URL
    return response.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return response.status(500).json({ message: "Stripe session failed" });
  }
};
