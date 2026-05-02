import stripe from "../configs/stripe.js";
import * as Payments from "../models/paymentModel.js";

export const stripeWebhook = async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log("Webhook signature verification failed:", err.message);
    return response.sendStatus(400);
  }

  try {
    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const stripe_session_id = session.id;
      const payment_intent_id = session.payment_intent;

      //  Update payment
      const payment = await Payments.markPaymentSuccess({
        stripe_session_id,
        payment_intent_id,
      });

      if (!payment) {
        console.log("Payment not found or already updated");
        return response.json({ received: true });
      }

      // 2️Update billing
      await Payments.markBillingPaid(payment.billing_id);

      console.log("Payment success & billing updated");
    }

    // Handle failed payment
    if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object;

      await Payments.markPaymentFailed(intent.id);
    }

    return response.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return response.sendStatus(500);
  }
};
