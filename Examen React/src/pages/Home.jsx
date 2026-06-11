import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext.jsx';
import AltaModal from './AltaModal.jsx';

const urlApi = import.meta.env.VITE_API_URL;

const NOTE_BG = {
  'note-yellow': '#FFF9C4',
  'note-pink': '#F8BBD0',
  'note-blue': '#BBDEFB',
  'note-green': '#C8E6C9',
  'note-orange': '#FFE0B2',
};

function noteRot(id) {
  return ((id * 7919) % 9) - 4;
}

function formatDate(raw) {
  if (!raw) return '';
  const d = new Date(raw);
  return isNaN(d) ? raw : d.toLocaleString('ca-ES', { dateStyle: 'short', timeStyle: 'short' });
}

const Home = () => {
  const { token, user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${urlApi}notes/all`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      })
      .then(({ data }) => setNotes(data.data ?? data))
      .catch(console.error);
  }, [token]);

  const handleToggle = (id) => {
    axios
      .patch(`${urlApi}notes/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      })
      .then(({ data }) => {
        const updated = data.data ?? data;
        setNotes(prev =>
          prev.map(n => n._id === id ? { ...n, done: updated.done ?? !n.done } : n)
        );
      })
      .catch(console.error);
  };

  const handleDelete = (id) => {
    console.log(id);
    axios
      .delete(`${urlApi}notes/${id}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      })
      .then(() => setNotes(prev => prev.filter(n => n._id !== id)))
      .catch(console.error);
  };

  const handleNoteAdded = (newNote) => {
    setNotes(prev => [newNote, ...prev]);
  };

  return (
    <>
      {/* Botó flotant per obrir el modal */}
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
        onClick={() => setModalOpen(true)}
        title="Nova nota"
      >
        <i className="bi bi-plus-lg"></i>
      </button>

      <AltaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onNoteAdded={handleNoteAdded}
      />

      {/* Contingut del tauler */}
      <div className="position-relative p-2" style={{ zIndex: 1 }}>
        {notes.length === 0 ? (
          <div
            className="d-flex flex-column align-items-center justify-content-center py-5 gap-2"
            style={{ color: 'rgba(80,40,5,0.45)' }}
          >
            <span style={{ fontSize: 36 }}>📌</span>
            <p className="mb-0" style={{ fontSize: 13 }}>
              No hay notas todavía. ¡Añade la primera!
            </p>
          </div>
        ) : (
          <div className="d-flex flex-wrap gap-3" style={{ alignContent: "flex-start" }}>
            {notes.map(note => (
              <div key={note._id} className="col">
                <div
                  className={`tablon-note${note.done ? " done" : ""}`}
                  style={{
                    background: NOTE_BG[note.color],
                    transform: `rotate(${noteRot(note._id)}deg)`,
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
                      onClick={() => handleToggle(note._id)}
                      aria-label={note.done ? "Marcar pendiente" : "Marcar completada"}
                    >
                      {note.done ? "↺" : "✓"}
                    </button>
                    <button
                      className="tablon-note-btn del-btn"
                      onClick={() => {handleDelete(note._id);console.log("Nota eliminada:", note._id);}}
                      
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
};

export default Home;
