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

//to check if api is working
app.get("test",(req,res)=>{
    res.end("API is working");
});

app.use("/api", rankRoutes);

export default app;
