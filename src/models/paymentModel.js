import { pool } from "../configs/db.js";

/**
 * Create a new payment entry (when checkout session is created)
 */
export async function createPayment({
  billing_id,
  user_id,
  stripe_session_id,
  amount,
  currency = "inr",
}) {
  try {
    const result = await pool.query(
      `
    INSERT INTO payments (
      billing_id,
      user_id,
      stripe_session_id,
      amount,
      currency,
      status
    )
    VALUES ($1, $2, $3, $4, $5, 'pending')
    RETURNING *;
    `,
      [billing_id, user_id, stripe_session_id, amount, currency],
    );

    return result.rows[0];
  } catch (error) {
    console.log("Error creating new payment entry", error);
    throw error;
  }
}

/**
 * Update payment after Stripe webhook success
 */
export async function markPaymentSuccess({
  stripe_session_id,
  stripe_payment_intent_id,
}) {
  try {
    const result = await pool.query(
      `
    UPDATE payments
      SET status = 'succeeded',
          stripe_payment_intent_id = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE stripe_session_id = $2
      AND status != 'succeeded'
      RETURNING *;
    `,
      [stripe_payment_intent_id, stripe_session_id],
    );

    return result.rows[0];
  } catch (error) {
    console.log("Error updating the payment status-succeeded", error);
    throw error;
  }
}

/**
 * Mark payment as failed
 */
export async function markPaymentFailed(stripe_session_id) {
  try {
    const result = await pool.query(
      `
    UPDATE payments
    SET status = 'failed',
        updated_at = CURRENT_TIMESTAMP
    WHERE stripe_session_id = $1
    RETURNING *;
    `,
      [stripe_session_id],
    );

    return result.rows[0];
  } catch (error) {
    console.log("Error updating the payment status-failed", error);
    throw error;
  }
}

/**
 * Get all payments for a user
 */
export async function getPaymentsByUser(user_id) {
  try {
    const result = await pool.query(
      `
    SELECT * FROM payments
    WHERE user_id = $1
    ORDER BY created_at DESC;
    `,
      [user_id],
    );

    return result.rows;
  } catch (error) {
    console.log("Error while getting payment details by user id", error);
    throw error;
  }
}

/**
 * Get payments for a billing record
 */
export async function getPaymentsByBilling(billing_id) {
  try {
    const result = await pool.query(
      `
    SELECT * FROM payments
    WHERE billing_id = $1
    ORDER BY created_at DESC;
    `,
      [billing_id],
    );

    return result.rows;
  } catch (error) {
    console.log("Error while getting payment details by billing id", error);
    throw error;
  }
}

/**
 * Update billing table and the pendinf status to paid id payment succeeded
 */
export async function markBillingPaid(billing_id) {
  try {
    await pool.query(
      `
      UPDATE billing
      SET status = 'paid',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1;
      `,
      [billing_id],
    );
  } catch (error) {
    console.log("Error updating billing status", error);
    throw error;
  }
}

/**
 * Get billing detail by billing_id
 */
export async function getBillingByBillingId(billing_id) {
  try {
    const result = await pool.query(
      `
    SELECT * FROM billing
    WHERE id = $1
    `,
      [billing_id],
    );

    return result.rows[0];
  } catch (error) {
    console.log("Error while getting billing details by billing id", error);
    throw error;
  }
}
