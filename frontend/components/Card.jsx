import React from 'react';
import { MdDelete, MdEdit, MdStar, MdStarBorder } from "react-icons/md";

const Card = ({ id, title, desc, deleteNote, editNote, important }) => {
  return (
    <div className='card'>
      {/* Top row: title + star on left, buttons on right */}
      <div className="card-header">
        <div className="title-container">
          <span className="title">{title}</span>
          {important ? <MdStar className="star" color="gold" /> : <MdStarBorder className="star" color="#ccc" />}
        </div>
        <div className="card-buttons">
          {/* Pass id to edit/delete handlers */}
          <div className="edit" onClick={() => editNote(id)}><MdEdit /></div>
          <div className="del" onClick={() => deleteNote(id)}><MdDelete /></div>
        </div>
      </div>

      <div className="desc">{desc}</div>
    </div>
  );
};

export default Card;
