import React, { useContext } from 'react'
import noteContext from '../context/notes/noteContext';

const NoteItem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note } = props;
    return (
        <div className='col-md-3'>
            <div className="card my-2" >
                    <div className="card-body">
                        <h5 className="card-title">{note.title}</h5>
                        <p className="card-text">{note.description}</p>
                        <i className="mx-2 far fa-trash-alt" onClick={()=> {deleteNote(note._id)}}></i>
                        <i className="mx-2 far fa-edit"></i>
                    </div>
            </div>
        </div>
    )
}

export default NoteItem
