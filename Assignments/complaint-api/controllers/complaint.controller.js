let complaints = [];
let nextId = 1;

// Get all complaints
export const getAllComplaints = (req, res) => {
  res.status(200).json({
    success: true,
    data: complaints,
  });
};

// Create a new complaint
export const createComplaint = (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required",
    });
  }

  const newComplaint = {
    id: nextId++,
    title,
    description,
    status: "open",
  };
  console.log("Complaints:", complaints);

  complaints.push(newComplaint);

  res.status(201).json({
    success: true,
    data: newComplaint,
  });
};

// Resolve a complaint
export const resolveComplaint = (req, res) => {
  const id = parseInt(req.params.id);

  const complaint = complaints.find((c) => c.id === id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }

  complaint.status = "resolved";

  res.status(200).json({
    success: true,
    data: complaint,
  });
};

// Delete a complaint
export const deleteComplaint = (req, res) => {
  const id = parseInt(req.params.id);

  const index = complaints.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }

  complaints.splice(index, 1);

  // const complaint = complaints.find((c) => c.id === id);
  // if (!complaint) return;
  // complaints = complaints.filter((c) => c.id !== id);

  res.status(200).json({
    success: true,
    message: "Complaint deleted successfully",
  });
};
