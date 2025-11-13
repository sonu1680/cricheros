import express from "express";
import { calculateRank } from "../controllers/calculateRank.js";

const rankRoutes = express.Router();

rankRoutes.post("/calculate", calculateRank);

export default rankRoutes;
