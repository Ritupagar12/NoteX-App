import express from 'express'; // Express framework
import mongoose from 'mongoose'; // MongoDB ODM
import cors from 'cors'; // Allow frontend to talk to backend
import dotenv from 'dotenv'; // Load environment variables from .env
import notesRouter from './routes/notes.js'; // Import notes routes

dotenv.config(); // Load .env file

const app = express(); // Create Express app

// Middleware
app.use(cors()); // // Allow all origins for now, or restrict to frontend URL
app.use(express.json()); // Parse JSON in request bodies

// Routes 
app.use('/api/notes', notesRouter); // All requests to /api/notes go to notesRouter

// Port and Mongo URI
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB 
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log('MongoDB connection error:', err));