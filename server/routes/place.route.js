import express from "express";

import * as placeController from "../controllers/place.controller.js";

const router = express.Router();

router.get("/", placeController.getAllPlaces);
router.get("/search", placeController.searchPlaces);

export default router;
