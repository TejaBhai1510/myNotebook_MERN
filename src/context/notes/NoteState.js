import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Get All Notes
  const getNotes = async () => {
    // API Call
    const response = await fetch(`${host}/api/host/fetchallnotes`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjEzMWRjNWUzZTQwMzdjZDQ3MzRhMDY2In0sImlhdCI6MTYzMDY2OTU5Nn0.hJS0hx6I7ROugkqjL2CjrJuefA3pJi-IU5yGUbRHI4Q',
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json);
  }

  // Add a Note
  const addNote = async (title, description, tag) => {
    // API Call
    const response = await fetch(`${host}/api/host/addnote`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjEzMWRjNWUzZTQwMzdjZDQ3MzRhMDY2In0sImlhdCI6MTYzMDY2OTU5Nn0.hJS0hx6I7ROugkqjL2CjrJuefA3pJi-IU5yGUbRHI4Q',
      },
      body: JSON.stringify({title, description, tag}),
    })
    // Client side logic
    const note = {
      "_id": "61322f19553781a8ca8d0e8",
      "user": "6131dc5e3e4037cd4734a066",
      "title": title,
      "description": description,
      "tag": tag,
      "date": "2021-09-03T14:20:09.668Z",
      "__v": 0
    };
    setNotes(notes.concat(note));
  }

  // Delete a Note
  const deleteNote = (id) => {
    // TODO: API Call
    const newNotes = notes.filter((note) => {return note._id !== id});
    setNotes(newNotes);
   }

  // Update a Note
  const editNote = async (id, title, description, tag) => {
    // API Call
    const response = await fetch(`${host}/api/host/updatenote/${id}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjEzMWRjNWUzZTQwMzdjZDQ3MzRhMDY2In0sImlhdCI6MTYzMDY2OTU5Nn0.hJS0hx6I7ROugkqjL2CjrJuefA3pJi-IU5yGUbRHI4Q',
      },
      body: JSON.stringify({title, description, tag}),
    })
    const json = response.json;
    // Client side Logic
    for (let i = 0; i < notes.length; i++) {
      const element = notes[i];
      if(element._id === id){
        element.title = title;
        element.description = description;
        element.tag = tag;
      }
    }
  }

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
};

export default NoteState;