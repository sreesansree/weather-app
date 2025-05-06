import express from "express";
import { getWeather, getHistory } from "../controllers/weatherController.js";

const router = express.Router();

router.get("/", getWeather);
router.get("/history", getHistory);

export default router;
