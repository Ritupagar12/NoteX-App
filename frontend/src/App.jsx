import './App.css'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import Card from '../components/Card'
import axios from 'axios';

// Backend API base URL
const API_URL = "http://localhost:5000/api/notes";

function App() {
  const [notes, setNotes] = useState([]) // State to store all notes
  const [currentNote, setcurrentNote] = useState({ title: "", desc: "" }) // State fo rthe current note being typed 
  const [filter, setFilter] = useState('all'); // State for filtering tabs: 'all' or 'important'
  const [editingId, setEditingId] = useState(null); // track which note is being edited
  const [message, setMessage] = useState(''); // state for showing success messages
  const [searchQuery, setSearchQuery] = useState('') // new compact search bar state

  // Fetch all notes from backend when app loads
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(API_URL); //Get All Notes
        setNotes(res.data); // save notes in state
      } catch (err) {
        console.log("Error fetching notes:", err);
      }
    };
    fetchNotes();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target
    // If checkbox, use checked value; otherwise use text value
    setcurrentNote({ ...currentNote, [name]: type === 'checkbox' ? checked : value })
  }

  // Handle form submission (create or update note)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: empty fields

    if (!currentNote.title.trim() || !currentNote.desc.trim()) {
      setMessage("Please fill out both Title and Description.")
      setTimeout(() => setMessage(''), 3000)
      return
    }

    // Validation: duplicate title
    const isDuplicate = notes.some(note =>
      note.title.toLowerCase() === currentNote.title.toLowerCase() && note._id != editingId
    );

    if (isDuplicate) {
      setMessage("Title already exists. Choose a different title.");
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const noteToSend = {
      title: currentNote.title,
      desc: currentNote.desc,
      important: currentNote.important || false
    };

    if (editingId) {
      // Update a existing note 
      try {
        const res = await axios.put(`${API_URL}/${editingId}`, noteToSend); //Put request to backend
        // update local state
        setNotes(notes.map(note => note._id === editingId ? res.data : note));
        setcurrentNote({ title: "", desc: "", important: false }); // Reset form
        setEditingId(null); // Reset editing
        setMessage('Note updated successfully!');
        setTimeout(() => setMessage(''), 3000); // Hide message after 3s
      } catch (err) {
        console.log("Error updating note:", err);
      }
    } else {
      // Create new note
      try {
        const res = await axios.post(API_URL, noteToSend); //POST new note to backend
        setNotes([...notes, res.data]); //Add new note to state
        setcurrentNote({ title: "", desc: "", important: false })  // Reset Form
        setMessage("Note added successfully!");
        setTimeout(() => setMessage(''), 3000); // Hide message after 3s
      } catch (err) {
        console.log("Error creating note:", err);
      }
    }
  };

  // Edit a note by ID
  const editNote = (id) => {
    const noteToEdit = notes.find(note => note._id === id); // Find note by id
    if (!noteToEdit) return; // Safety check
    setcurrentNote({ title: noteToEdit.title, desc: noteToEdit.desc, important: noteToEdit.important });
    setEditingId(id);   // Set editingId to indicate editing mode
  };

  // Delete a note by ID
  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`); //Delete request to backend
      setNotes(notes.filter(note => note._id !== id)); // Remove note from state
      setMessage('Note deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.log("Error deleting note:", err);
    }
  };

  // Filter and search notes
  const filteredNotes = notes
    .filter(note => filter === 'all' || note.important)
    .filter(note =>
      note.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      note.desc.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );



  return (
    <>
      <Navbar>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="clear-btn"
              onClick={() => setSearchQuery('')}
            >
              ✖
            </button>
          )}
        </div>

      </Navbar>
      <main>
        <h1>Create your note</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input value={currentNote.title} onChange={handleChange} type="text" name="title" id="title" required />
          </div>
          <div>
            <label htmlFor="desc">Description</label>
            <textarea name="desc" id="desc" onChange={handleChange} value={currentNote.desc} required></textarea>
          </div>
          <div>
            <label>
              <input type='checkbox' name='important' checked={currentNote.important || false} onChange={(e) => setcurrentNote({ ...currentNote, important: e.target.checked })
              }
              />
              Mark as Important ⭐

            </label>
          </div>
          <button>{editingId ? 'Update' : 'Submit'}</button>

          {message && (
            <div className={`toast ${message ? 'show' : ''}`}>
              {message}
            </div>
          )}
        </form>

      </main>

      <section className='noteSection'>
        <h2>Your Notes</h2>
        <div className='tabs'>
          <button onClick={() => setFilter('all')}
            className={filter === 'all' ? 'active' : ''}>
            All Notes
          </button>
          <button onClick={() => setFilter('important')}
            className={filter === 'important' ? 'active' : ''}>
            Important
          </button>
        </div>

        <div className='container'>
          {filteredNotes.length > 0 ? (
            filteredNotes.map(note => (
              <Card
                key={note._id}
                id={note._id}
                deleteNote={deleteNote}
                editNote={editNote}
                title={note.title}
                desc={note.desc}
                important={note.important || false}
              />
            ))
          ) : (
            searchQuery
              ? <div>No notes found for "{searchQuery}"</div>
              : <div>Add a note to continue</div>
          )}
        </div>

      </section>
    </>
  );
}

export default App
