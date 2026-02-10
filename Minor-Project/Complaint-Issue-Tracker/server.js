import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import complaintRoutes from "./src/routes/complaintRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());

// Static folder
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.use("/complaints", complaintRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running -> http://localhost:${PORT}`);
  console.log(`Serving static files from: ${publicPath}`);
});