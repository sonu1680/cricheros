import express from "express";
import cors from "cors";
import matchRoutes from "./router/matchRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", matchRoutes);

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
