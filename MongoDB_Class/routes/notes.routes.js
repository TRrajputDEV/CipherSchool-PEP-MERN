import express from 'express';
import Note from '../models/Note.model.js';

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content)
      return res.status(400).json({ error: "Title and content are required" });

    const note = await Note.create({ title, content });

    res.status(201).json({
      message: "Note created successfully",
      note
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find()
    res.json({ 
      count: notes.length, 
      notes 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true } 
    );
    
    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    
    res.json({ 
      message: "Note updated successfully", 
      note: updatedNote 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    
    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    
    res.json({ 
      message: "Note deleted successfully", 
      note: deletedNote 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;