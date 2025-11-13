import express from "express";
import cors from "cors";

import { limiter } from "./const/limiter";
import rankRoutes from "./router/rankRoutes";

const app = express();
app.use(cors());
app.use(express.json());


app.use(limiter); 

app.use("/api", rankRoutes);

const PORT = process.env.PORT||5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
