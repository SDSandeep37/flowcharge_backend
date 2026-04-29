import * as User from "../models/usersModel.js";
import {
  emailValidator,
  hashPassword,
  nameValidator,
  passwordValidator,
} from "../utils/validations.js";
import { createTokenCookie, destroyTokenCookie } from "../utils/cookies.js";
import jsonwebtoken from "jsonwebtoken";

// Create user i.e consumer funtion
export async function createUserController(request, response) {
  // return if no user data
  if (!request.body) {
    return response.status(400).json({
      success: false,
      message: "User data required",
    });
  }

  // destructing user details
  const { name, email, password } = request.body;
  const validateName = name ? nameValidator(name) : "";
  const validateEmail = email ? emailValidator(email) : "";
  const validatePassword = password ? passwordValidator(password) : "";
  const role = "consumer";

  if (!validateName) {
    return response.status(400).json({
      success: false,
      message: "Valid name is required",
    });
  }
  if (!validateEmail) {
    return response.status(400).json({
      success: false,
      message: "Valid email is required",
    });
  }
  if (!validatePassword) {
    return response.status(400).json({
      success: false,
      message:
        "Password must contain combination of uppercase,lowercase,number,symbol and minimum 6 letters",
    });
  }

  //encrypting password
  const hashedPassword = await hashPassword(password);
  const checkEmail = await User.checkEmailExist(email);
  if (checkEmail) {
    return response.status(400).json({
      success: false,
      message: "We have already a user with this email",
    });
  }

  try {
    const user = await User.createUser(name, email, hashedPassword, role);
    if (!user) {
      return response.status(400).json({
        success: false,
        message: "User creation failed",
      });
    }

    // generating json web token
    const token = jsonwebtoken.sign(
      { user: user.id, email: user.email, userrole: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "1h" },
    );

    //Storing cookie named token
    const maxAge = process.env.JWT_EXPIRE
      ? parseInt(process.env.JWT_EXPIRE) * 1000 * 60 * 60
      : 3600000;

    createTokenCookie(response, token, maxAge);

    response.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user", error);
    response.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
//create admin
export async function createAdmin(request, response) {
  // return if no user data
  if (!request.body) {
    return response.status(400).json({
      success: false,
      message: "Admin data required",
    });
  }

  // destructing user details
  const { name, email, password } = request.body;
  const validateName = name ? nameValidator(name) : "";
  const validateEmail = email ? emailValidator(email) : "";
  const validatePassword = password ? passwordValidator(password) : "";
  const role = "admin";

  if (!validateName) {
    return response.status(400).json({
      success: false,
      message: "Valid name is required",
    });
  }
  if (!validateEmail) {
    return response.status(400).json({
      success: false,
      message: "Valid email is required",
    });
  }
  if (!validatePassword) {
    return response.status(400).json({
      success: false,
      message:
        "Password must contain combination of uppercase,lowercase,number,symbol and minimum 6 letters",
    });
  }

  //encrypting password
  const hashedPassword = await hashPassword(password);
  const checkEmail = await User.checkEmailExist(email);
  if (checkEmail) {
    return response.status(400).json({
      success: false,
      message: "We have already a user with this email",
    });
  }

  try {
    const user = await User.createUser(name, email, hashedPassword, role);
    if (!user) {
      return response.status(400).json({
        success: false,
        message: "User creation failed",
      });
    }

    // generating json web token
    const token = jsonwebtoken.sign(
      { user: user.id, email: user.email, userrole: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "1h" },
    );

    //Storing cookie named token
    const maxAge = process.env.JWT_EXPIRE
      ? parseInt(process.env.JWT_EXPIRE) * 1000 * 60 * 60
      : 3600000;

    createTokenCookie(response, token, maxAge);

    response.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user", error);
    response.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
//create users
export async function createUserOwner(request, response) {
  const { userrole } = request.user;

  if (userrole === "consumer" || userrole === "owner") {
    return response.status(401).json({
      success: false,
      message: "Unauthorised access!",
    });
  }
  // return if no user data
  if (!request.body) {
    return response.status(400).json({
      success: false,
      message: "User or Owner data required",
    });
  }

  // destructing user details
  const { name, email, password, role } = request.body;
  const validateName = name ? nameValidator(name) : "";
  const validateEmail = email ? emailValidator(email) : "";
  const validatePassword = password ? passwordValidator(password) : "";

  if (!validateName) {
    return response.status(400).json({
      success: false,
      message: "Valid name is required",
    });
  }
  if (!validateEmail) {
    return response.status(400).json({
      success: false,
      message: "Valid email is required",
    });
  }
  if (!validatePassword) {
    return response.status(400).json({
      success: false,
      message:
        "Password must contain combination of uppercase,lowercase,number,symbol and minimum 6 letters",
    });
  }
  if (!role || (role !== "consumer" && role !== "owner")) {
    return response.status(400).json({
      message: "Role should be consumer or owner.",
      success: false,
    });
  }
  //encrypting password
  const hashedPassword = await hashPassword(password);
  const checkEmail = await User.checkEmailExist(email);
  if (checkEmail) {
    return response.status(400).json({
      success: false,
      message: "We have already a user with this email",
    });
  }

  try {
    const user = await User.createUser(name, email, hashedPassword, role);
    if (!user) {
      return response.status(400).json({
        success: false,
        message: "User creation failed",
      });
    }
    response.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user", error);
    response.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Login controller function
export async function loginController(request, response) {
  // return if no user data
  if (!request.body) {
    return response.status(400).json({
      success: false,
      message: "Login details required",
    });
  }

  const { email, password } = request.body;
  if (!email) {
    return response.status(400).json({
      error: "Email Required",
      requestedEmail: email,
    });
  }
  if (!password || password.trim() === "") {
    return response.status(400).json({
      error: "Password Required",
      pass: password,
    });
  }

  try {
    const checkEmail = await User.checkEmailExist(email);
    if (!checkEmail) {
      return response.status(400).json({
        success: false,
        message: "No user associated with us, with this email.",
      });
    }
    const user = await User.checkEmailPassword(email, password);
    if (!user) {
      return response.status(400).json({
        success: false,
        message: "Email or password is incorrect.",
      });
    }
    // generating json web token
    const token = jsonwebtoken.sign(
      { user: user.id, email: user.email, userrole: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "1h" },
    );

    //Storing cookie named token
    const maxAge = process.env.JWT_EXPIRE
      ? parseInt(process.env.JWT_EXPIRE) * 1000 * 60 * 60
      : 3600000;

    createTokenCookie(response, token, maxAge);
    response.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error login user", error);
    response.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get user by id controller
export async function getUserByIdContoller(request, response) {
  let userId = 0;
  if (request.user) {
    const { user } = request.user;
    userId = user;
  } else {
    const { id } = request.params;
    userId = id;
  }

  try {
    const userDetails = await User.getUserById(userId);
    if (!userDetails) {
      return response.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    return response.status(200).json({
      success: true,
      user: userDetails,
    });
  } catch (error) {
    console.error(`Error while fetching user details: ${error}`);
    response.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// get all the owners
export async function getAllOwnersController(request, response) {
  try {
    const owners = await User.getAllOwners();
    if (!owners || owners.length === 0) {
      return response.status(400).json({
        success: false,
        message: "No owners found",
      });
    }
    return response.status(200).json({
      success: true,
      owners: owners,
    });
  } catch (error) {
    console.error(`Error while fetching owners: ${error}`);
    response.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
// get all the consumers
export async function getAllConsumersController(request, response) {
  try {
    const consumers = await User.getAllConsumers();
    if (!consumers || consumers.length === 0) {
      return response.status(400).json({
        success: false,
        message: "No consumers found",
      });
    }
    return response.status(200).json({
      success: true,
      consumers: consumers,
    });
  } catch (error) {
    console.error(`Error while fetching consumers: ${error}`);
    response.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// logout controller
export function logoutController(request, response) {
  destroyTokenCookie(response);
  response.status(200).json({
    success: true,
    message: "Logout successful",
  });
}
