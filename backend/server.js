import express from 'express'; // Express framework
import mongoose from 'mongoose'; // MongoDB ODM
import cors from 'cors'; // Allow frontend to talk to backend
import dotenv from 'dotenv'; // Load environment variables from .env
import notesRouter from './routes/notes.js'; // Import notes routes

dotenv.config(); // Load .env file

const app = express(); // Create Express app

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON in request bodies

// Routes 
app.use('/api/notes', notesRouter); // All requests to /api/notes go to notesRouter

// Connect to MongoDB 
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected'); // Connection successful
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)); // Start server
  })
  .catch(err => console.log(err)); // Handle connection errors
