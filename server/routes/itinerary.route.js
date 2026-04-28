import express from "express";

import * as itineraryController from "../controllers/itinerary.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate", verifyToken, itineraryController.generateItinerary);
router.get("/my-itineraries", verifyToken, itineraryController.getMyItineraries);
router.get("/", itineraryController.getAllItinerariesSummary);
router.get("/:id", itineraryController.getItineraryDetail);

export default router;
