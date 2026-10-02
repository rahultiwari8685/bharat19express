import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Subscriber from "../models/Subscriber.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing customer
    const existingCustomer = await Subscriber.findOne({
      email: normalizedEmail,
    });

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer
    const subscriber = await Subscriber.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : "",
    });

    // Generate token
    const token = jwt.sign(
      {
        customerId: subscriber._id,
        email: subscriber.email,
        role: "customer",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(201).json({
      success: true,
      message: "Customer registration successful",
      token,
      customer: {
        id: subscriber._id,
        name: subscriber.name,
        email: subscriber.email,
        phone: subscriber.phone || "",
      },
    });
  } catch (error) {
    console.error("Customer Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const subscriber = await Subscriber.findOne({
      email: normalizedEmail,
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const isMatch = await bcrypt.compare(password, subscriber.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        customerId: subscriber._id,
        email: subscriber.email,
        role: "customer",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.json({
      success: true,
      message: "Customer login successful",
      token,
      customer: {
        id: subscriber._id,
        name: subscriber.name,
        email: subscriber.email,
        phone: subscriber.phone || "",
      },
    });
  } catch (error) {
    console.error("Customer Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;
