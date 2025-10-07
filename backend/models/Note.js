import mongoose from 'mongoose'; // Import mongoose to define schema and interact with MongoDB

// Define a schema for our notes
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // Title must exist and be unique
  desc: { type: String, required: true }, // Description is required
  important: {type: Boolean, default:false},
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Export the model so we can use it in routes
export default mongoose.model('Note', noteSchema);
