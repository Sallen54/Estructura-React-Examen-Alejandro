
import { useState,useEffect } from "react";
import { useAuth } from '../auth/AuthContext.jsx';



const COLORS = [
  { cls: "note-yellow", hex: "#FFF9C4" },
  { cls: "note-pink",   hex: "#F8BBD0" },
  { cls: "note-blue",   hex: "#BBDEFB" },
  { cls: "note-green",  hex: "#C8E6C9" },
  { cls: "note-orange", hex: "#FFE0B2" },
];

const NOTE_BG = {
  "note-yellow": "#FFF9C4",
  "note-pink":   "#F8BBD0",
  "note-blue":   "#BBDEFB",
  "note-green":  "#C8E6C9",
  "note-orange": "#FFE0B2",
};

function noteRot(id) {
  return ((id * 7919) % 9) - 4;
}


const Home = () => {
       
        return (
        <>

          {/* Posar just abans del </> del component principal */}
          <button
            className="btn btn-dark rounded-circle shadow"
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              width: '56px',
              height: '56px',
              fontSize: '1.5rem',
              zIndex: 1000,
            }}
            data-bs-toggle="modal"
            data-bs-target="#modalNovaNota"
            title="Nova nota"
          >
            <i className="bi bi-plus-lg"></i>
          </button>






         {/* Contenido sobre el corcho */}
           <div className="position-relative p-2" style={{ zIndex: 1 }}>

          {notes.length === 0 ? (
               <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2"
                   style={{ color: "rgba(80,40,5,0.45)" }}>
                <span style={{ fontSize: 36 }}>📌</span>
                <p className="mb-0" style={{ fontSize: 13 }}>No hay notas todavía. ¡Añade la primera!</p>
              </div>
            ) : (
             <div className="d-flex flex-wrap gap-3" style={{ alignContent: "flex-start" }}>
                {notes.map(note => (
                  <div key={note.id} className="col">
                  <div
                    className={`tablon-note${note.done ? " done" : ""}`}
                    style={{
                      background: NOTE_BG[note.color],
                      transform: `rotate(${noteRot(note.id)}deg)`,
                    }}
                  >
                    <div className="tablon-note-pin" />
                    <div className={`tablon-note-text${note.done ? " done" : ""}`}>
                      {note.text}
                    </div>
                    <div className="tablon-note-date">{note.date}</div>
                    <div className="tablon-note-user"> {note.user}</div>
                    <div className="tablon-note-actions">
                      <button
                        className="tablon-note-btn done-btn"
                        aria-label={note.done ? "Marcar pendiente" : "Marcar completada"}
                      >
                        {note.done ? "↺" : "✓"}
                      </button>
                      <button
                        className="tablon-note-btn del-btn"
                        aria-label="Eliminar nota"
                      >
                        X
                      </button>
                    </div>
                  </div>
                  </div>
                ))}
              </div>
            )}
        </div>



    </>
    );
}

export default Home;    
