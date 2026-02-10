let complaints = [];
let nextId = 1;

function generateComplaintId() {
  return `CMP${String(nextId++).padStart(5, "0")}`;
}

// GET all complaints
export const getAllComplaints = (req, res) => {
  res.json(complaints);
};

// GET complaint by id
export const getComplaintById = (req, res) => {
  const complaint = complaints.find((c) => c.id === req.params.id);
  if (!complaint) {
    return res.status(404).json({ error: "Complaint not found" });
  }
  res.json(complaint);
};

// POST new complaint
export const createComplaint = (req, res) => {
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
};

// PUT update status
export const updateComplaintStatus = (req, res) => {
  const { status } = req.body;

  if (!status || !["pending", "resolved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const complaint = complaints.find((c) => c.id === req.params.id);
  if (!complaint) {
    return res.status(404).json({ error: "Complaint not found" });
  }

  complaint.status = status;
  complaint.updatedAt = new Date().toISOString();
  res.json(complaint);
};

// DELETE complaint
export const deleteComplaint = (req, res) => {
  const index = complaints.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Complaint not found" });
  }

  complaints.splice(index, 1);
  res.json({ message: "Complaint deleted successfully" });
};