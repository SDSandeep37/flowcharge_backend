import { pool } from "../configs/db.js";
import { comparePassword } from "../utils/validations.js";

// Function to create new user
export async function createUser(name, email, password, role) {
  try {
    const result = await pool.query(
      `
      INSERT INTO users (name,email, password,role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
      [name, email, password, role],
    );
    const user = result.rows[0];

    // removing some informations
    delete user.password;
    delete user.created_at;
    delete user.updated_at;
    return user;
  } catch (error) {
    throw error;
  }
}

export async function checkEmailExist(email) {
  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE email = $1
      `,
      [email],
    );
    if (result.rowCount === 0) {
      return false;
    }

    const userEmail = result.rows[0].email;
    return userEmail;
  } catch (error) {
    throw error;
  }
}
// check user password and email
export async function checkEmailPassword(email, userPassword) {
  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE email = $1 
      `,
      [email],
    );

    if (result.rowCount === 0) return false;

    const user = result.rows[0];
    const isMatch = await comparePassword(userPassword, user.password);
    if (!isMatch) {
      return false; // incorrect password
    }

    // removing some informations
    delete user.password;
    delete user.created_at;
    delete user.updated_at;
    return user;
  } catch (error) {
    throw error;
  }
}

// get user by id
export async function getUserById(id) {
  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id = $1
      `,
      [id],
    );
    if (result.rowCount === 0) {
      return false;
    }

    const user = result.rows[0];
    delete user.password;
    delete user.created_at;
    delete user.updated_at;
    return user;
  } catch (error) {
    throw error;
  }
}
// get all the owners
export async function getAllOwners() {
  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE role = 'owner'
      `,
    );
    const owners = result.rows;
    owners.forEach((owner) => {
      delete owner.password;
      delete owner.created_at;
      delete owner.updated_at;
    });
    return owners;
  } catch (error) {
    throw error;
  }
}
// get all the consumers
export async function getAllConsumers() {
  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE role = 'consumer'
      `,
    );
    const consumers = result.rows;
    consumers.forEach((consumer) => {
      delete consumer.password;
      delete consumer.created_at;
      delete consumer.updated_at;
    });
    return consumers;
  } catch (error) {
    throw error;
  }
}
