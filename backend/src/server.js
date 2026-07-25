import cors from "cors";
import express from "express";
import "./db.js";
import { contactsRouter } from "./contactsRouter.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Contact book API listening on http://localhost:${PORT}`);
});
