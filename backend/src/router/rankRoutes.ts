import express from "express";
import { calculateTeamPosition } from "../controllers/calculateTeamPosition";

const rankRoutes = express.Router();

rankRoutes.post("/calculate", calculateTeamPosition);

export default rankRoutes;
