import { getAuth } from "../config/firebase.config.js";

// Verify Firebase ID token

export const verifyToken = async (req, res, next) => {
  try {
    const auth = getAuth();
    const idToken = req.headers.authorization?.split("Bearer ")[1];

    if (!idToken) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token with Firebase
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

// Check user role
export const checkRole = (roles) => {
  return (req, res, next) => {
    try {
      // Role checking logic here
    } catch (error) {
      res.status(403).json({ message: "Forbidden" });
    }
  };
};
