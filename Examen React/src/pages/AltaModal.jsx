import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext.jsx';

const urlApi = import.meta.env.VITE_API_URL;

const COLORS = [
  { cls: 'note-yellow', hex: '#FFF9C4' },
  { cls: 'note-pink',   hex: '#F8BBD0' },
  { cls: 'note-blue',   hex: '#BBDEFB' },
  { cls: 'note-green',  hex: '#C8E6C9' },
  { cls: 'note-orange', hex: '#FFE0B2' },
];

const validationSchema = Yup.object({
  text: Yup.string()
    .min(10, 'La nota ha de tenir almenys 10 caràcters')
    .max(200, 'La nota no pot superar els 200 caràcters')
    .required('El text és obligatori'),
});

const AltaModal = ({ isOpen, onClose, onNoteAdded }) => {
  const { token } = useAuth();
  const [selectedColor, setSelectedColor] = useState(COLORS[0].cls);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { text: '' },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setError('');
      try {
        const { data } = await axios.post(
          `${urlApi}notes`,
          { text: values.text, color: selectedColor },
          { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
        );
        onNoteAdded(data.data ?? data);
        resetForm();
        setSelectedColor(COLORS[0].cls);
        onClose();
      } catch (err) {
        setError(err.response?.data?.message ?? 'Error al crear la nota');
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: 'rgba(0,0,0,0.45)', zIndex: 1050 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-3 p-4"
        style={{ width: 300, border: '0.5px solid rgba(0,0,0,0.12)' }}
        role="dialog"
        aria-modal="true"
      >
        <p className="fw-semibold mb-3" style={{ fontSize: 14, color: '#111' }}>
          Nova nota
        </p>

        <form onSubmit={formik.handleSubmit} noValidate>
          <textarea
            name="text"
            className={`form-control mb-1${formik.touched.text && formik.errors.text ? ' is-invalid' : ''}`}
            style={{
              height: 90, fontSize: 13, resize: 'none',
              background: '#f5f5f5', color: '#111',
              border: '0.5px solid rgba(0,0,0,0.2)',
            }}
            placeholder="Escriu la teva nota aquí..."
            value={formik.values.text}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoFocus
          />
          {formik.touched.text && formik.errors.text && (
            <span className="text-danger small d-block mb-2">{formik.errors.text}</span>
          )}

          {/* Color selector */}
          <div className="d-flex gap-2 mb-3 mt-2">
            {COLORS.map(c => (
              <div
                key={c.cls}
                className={`tablon-color-dot${selectedColor === c.cls ? ' selected' : ''}`}
                style={{ background: c.hex }}
                onClick={() => setSelectedColor(c.cls)}
                role="radio"
                aria-checked={selectedColor === c.cls}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelectedColor(c.cls)}
              />
            ))}
          </div>

          {error && <p className="text-danger small mb-2">{error}</p>}

          <div className="d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="tablon-modal-btn-cancel border rounded-2 px-3 py-1"
              style={{ fontSize: 13, cursor: 'pointer' }}
              onClick={() => { formik.resetForm(); onClose(); }}
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              className="tablon-modal-btn-confirm border-0 rounded-2 px-3 py-1"
              style={{ fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AltaModal;
