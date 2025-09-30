import './App.css'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import Card from '../components/Card'

function App() {
  const [notes, setNotes] = useState([])
  const [currentNote, setcurrentNote] = useState({ title: "", desc: "" })
  
  useEffect(()=>{
    console.log("I am use effect")
    let localNotes = localStorage.getItem("notes")
    if (localNotes){
      setNotes(JSON.parse(localNotes))
    }
  }, [])


  const handleSubmit = (e) => {
    e.preventDefault()
    setNotes([...notes, currentNote])
    setcurrentNote({title: "", desc:""})
    localStorage.setItem("notes", JSON.stringify([...notes, currentNote]))
  }

  const deleteNote = (title)=>{
    setNotes(notes.filter(item => item.title != title))
    localStorage.setItem("notes", JSON.stringify(notes.filter(item => item.title != title)))
  }

  const handleChange = (e) => {
    setcurrentNote({ ...currentNote, [e.target.name]: e.target.value }) 
  }

  return (
    <>
      <Navbar />
      <main>
        <h1>Create your note</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input value={currentNote.title} onChange={handleChange} type="text" name="title" id="title" />
          </div>
          <div>
            <label htmlFor="desc">Description</label>
            <textarea name="desc" id="desc" onChange={handleChange} value={currentNote.desc}></textarea>
          </div>
          <button>Submit</button>
        </form>
      </main>
      <section className='noteSection'>
        <h2>Your Notes</h2>
        <div className='container'> 
        {notes && notes.map(note => {
          return <Card key={note.title} deleteNote={deleteNote} title={note.title} desc={note.desc}/>
        })}
        {notes.length == 0 && <div>Add a note to continue</div>}
        </div>
      </section>
    </>
  )
}

export default App
