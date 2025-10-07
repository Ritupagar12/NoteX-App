import express from 'express';
import Note from '../models/Note.js'; // Import the Note model to access the database

const router = express.Router(); // Create a router to define routes

//Get all Notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find(); // Fetch all notes from DB
    res.json(notes); // Send the notes back as JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Error handling
  }
});

// Create a note
router.post('/', async (req, res) => {
  const { title, desc, important } = req.body; // Get data from request body
  try {
    const newNote = new Note({ title, desc, important: important === true }); // Create a new note instance
    await newNote.save(); // Save it to MongoDB
    res.status(201).json(newNote); // Respond with the created note
  } catch (err) {
    res.status(400).json({ message: err.message }); // Validation errors
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id); // Delete by ID
    res.json({ message: 'Note deleted', note }); // Send confirmation
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  try {
    const {title, desc, important} = req.body;
    // Find note by ID and update fields from req.body
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, {title, desc, important:  important === true }, { new: true });
    res.json(updatedNote); // Respond with updated note
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router; // Export router to use in server.js
