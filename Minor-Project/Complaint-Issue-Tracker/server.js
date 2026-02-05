// server.js (ES module)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// static folder
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// Explicitly serve index.html at root (helps if someone opens / or static lookup fails)
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

/* -----------------------
   In-memory complaint API
   ----------------------- */
let complaints = [];
let nextId = 1;

function generateComplaintId() {
  return `CMP${String(nextId++).padStart(5, "0")}`;
}

// GET all complaints
app.get("/complaints", (req, res) => {
  res.json(complaints);
});

// GET complaint by id
app.get("/complaints/:id", (req, res) => {
  const complaint = complaints.find((c) => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });
  res.json(complaint);
});

// POST new complaint
app.post("/complaints", (req, res) => {
  const { name, email, category, description } = req.body;
  if (!name || !email || !category || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const newComplaint = {
    id: generateComplaintId(),
    name,
    email,
    category,
    description,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  complaints.push(newComplaint);
  res.status(201).json(newComplaint);
});

// PUT update status
app.put("/complaints/:id", (req, res) => {
  const { status } = req.body;
  if (!status || !["pending", "resolved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const complaint = complaints.find((c) => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });
  complaint.status = status;
  complaint.updatedAt = new Date().toISOString();
  res.json(complaint);
});

// DELETE complaint
app.delete("/complaints/:id", (req, res) => {
  const index = complaints.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Complaint not found" });
  complaints.splice(index, 1);
  res.json({ message: "Complaint deleted successfully" });
});

/* -----------------------
   Error handler + start
   ----------------------- */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running -> http://localhost:${PORT}`);
  console.log(`Serving static files from: ${publicPath}`);
});
