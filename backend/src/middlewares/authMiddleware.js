// import jwt from "jsonwebtoken";

// export const verifySubscriber = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Authorization token missing",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (decoded.role !== "customer") {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied",
//       });
//     }

//     req.user = {
//       customerId: decoded.customerId,
//       email: decoded.email,
//       role: decoded.role,
//     };

//     next();
//   } catch (error) {
//     console.error("Customer Auth Error:", error.message);

//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };


// export const optionalViewAuth = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     // Guest visitor: allow view tracking without login
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       req.viewerId = null;
//       req.viewerType = "anonymous";
//       return next();
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (decoded.role === "customer" && decoded.customerId) {
//       req.viewerId = decoded.customerId;
//       req.viewerType = "customer";
//     } else if (decoded.userId) {
//       req.viewerId = decoded.userId;
//       req.viewerType = "user";
//     } else {
//       req.viewerId = null;
//       req.viewerType = "anonymous";
//     }

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };



import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Customer from "../models/Customer.js";

// ==========================================
// 1. VERIFY SUBSCRIBER / CUSTOMER
// ==========================================

export const verifySubscriber = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "customer" || !decoded.customerId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const customer = await Customer.findById(decoded.customerId).select(
      "_id name email status"
    );

    if (!customer || customer.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Customer account is not active",
      });
    }

    req.user = {
      customerId: customer._id,
      email: customer.email,
      role: "customer",
    };

    next();
  } catch (error) {
    console.error("Subscriber Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


// ==========================================
// 2. VERIFY ADMIN / EDITOR / CORRESPONDENCE
// ==========================================

export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid user token",
      });
    }

    const user = await User.findById(decoded.userId).select(
      "_id name email role post_permission user_status"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.user_status !== "active") {
      return res.status(403).json({
        success: false,
        message: "User account is not active",
      });
    }

    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    console.error("User Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


// ==========================================
// 3. OPTIONAL VIEW AUTH
// Guest + Subscriber + Admin + Editor + Correspondence
// ==========================================

export const optionalViewAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Default: Guest visitor
    req.viewerId = null;
    req.viewerType = "anonymous";

    // No token: allow guest view tracking
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Subscriber / Customer
    if (decoded.role === "customer" && decoded.customerId) {
      const customer = await Customer.findById(decoded.customerId).select(
        "_id status"
      );

      if (customer && customer.status === "active") {
        req.viewerId = customer._id;
        req.viewerType = "customer";
      }

      return next();
    }

    // Admin / Editor / Correspondence
    if (decoded.userId) {
      const user = await User.findById(decoded.userId).select(
        "_id user_status"
      );

      if (user && user.user_status === "active") {
        req.viewerId = user._id;
        req.viewerType = "user";
      }

      return next();
    }

    return res.status(401).json({
      success: false,
      message: "Invalid user token",
    });

  } catch (error) {
    console.error("View Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

