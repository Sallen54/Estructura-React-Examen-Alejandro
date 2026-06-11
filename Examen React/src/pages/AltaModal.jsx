import {useState} from 'react'

const AltaModal = () => {


  return (
    
  <>
                    {/* MODAL */}
            {modalOpen && (
              <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ background: "rgba(0,0,0,0.45)", zIndex: 10 }}
                onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
              >
                <div
                  className="bg-white rounded-3 p-4"
                  style={{ width: 280, border: "0.5px solid rgba(0,0,0,0.12)" }}
                  role="dialog"
                  aria-modal="true"
                >
                  <p className="fw-500 mb-3" style={{ fontSize: 14, color: "#111" }}>
                    Nueva nota
                  </p>
                  <textarea
                    className="form-control mb-3"
                    style={{
                      height: 90, fontSize: 13, resize: "none",
                      background: "#f5f5f5", color: "#111",
                      border: "0.5px solid rgba(0,0,0,0.2)",
                    }}
                    placeholder="Escribe tu nota aquí..."
                    maxLength={200}
                    value={text}
                    autoFocus
                  />
                  <div className="d-flex gap-2 mb-3">
                    {COLORS.map(c => (
                      <div
                        key={c.cls}
                        className={`tablon-color-dot${selectedColor === c.cls ? " selected" : ""}`}
                        style={{ background: c.hex }}
                        onClick={() => setSelectedColor(c.cls)}
                        role="radio"
                        aria-checked={selectedColor === c.cls}
                        tabIndex={0}
                      />
                    ))}
                  </div>
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      className="tablon-modal-btn-cancel border rounded-2 px-3 py-1"
                      style={{ fontSize: 13, cursor: "pointer" }}
                      onClick={closeModal}
                    >
                      Cancelar
                    </button>
                    <button
                      className="tablon-modal-btn-confirm border-0 rounded-2 px-3 py-1"
                      style={{ fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}  
  
  </>

  )
}

export default AltaModal
