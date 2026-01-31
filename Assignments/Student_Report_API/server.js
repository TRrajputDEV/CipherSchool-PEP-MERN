import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

const data = JSON.parse(fs.readFileSync("./data.json", "utf8"));

// API EndPoints: Get students.

app.get("/students", (req, res) => {
  res.json(data);
});
//  GET with the id.

app.get("/students/:id", (req, res) => {
  const student = data.find((s) => s.id == req.params.id);
  student
    ? res.json(student)
    : res.status(404).json({ message: "Student not found" });
});

app.post("/students", (req, res) => {
  const newStudent = req.body;
  if (!newStudent || !newStudent.id || !newStudent.name) {
    return res.status(400).json({ message: "Invalid student data" });
  }
  data.push(newStudent);

  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));

  res.status(201).json(newStudent);
});

app.delete('/students/:id', (req, res) => {
    const index = data.findIndex((s) => s.id == req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }
    
    const deletedStudent = data.splice(index, 1)[0];
    fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
    
    res.json(deletedStudent);
});

app.put('/students/:id', (req, res) => {
    const student = data.find((s) => s.id == req.params.id);
    
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    
    const updatedData = req.body;
    if (!updatedData.id || !updatedData.name) {
        return res.status(400).json({ message: "Invalid student data" });
    }
    
    Object.assign(student, updatedData);
    fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
    
    res.json(student);
});

app.get("/", (req, res) => {
  res.send("Welcome to the Student Report API");
});

app.listen(8000, () => {
  console.log("Server is Running at PORT 8000");
});
