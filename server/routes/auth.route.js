import express from "express";

import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

// Auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;
