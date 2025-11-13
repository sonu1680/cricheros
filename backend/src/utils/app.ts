import express from "express";
import cors from "cors";
import { limiter } from "../const/limiter";
import rankRoutes from "../router/rankRoutes";
import helmet from "helmet";

const app = express();

// enable CORS for cross-origin requests
app.use(cors());

// parse incoming JSON requests
app.use(express.json());

// Add Helmet to secure HTTP headers
app.use(helmet());

// apply rate limiting middleware
app.use(limiter);

app.use("/api", rankRoutes);

export default app;
