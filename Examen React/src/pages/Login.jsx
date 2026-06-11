import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useEffect, useState } from 'react';

const urlApi = import.meta.env.VITE_API_URL;

const validationSchema = Yup.object({
  email: Yup.string().email('El correu no és vàlid').required('El correu és obligatori'),
  password: Yup.string().min(6, 'La contrasenya és massa curta').required('La contrasenya és obligatòria'),
});

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/home', { replace: true });
  }, [isAuthenticated]);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values) => {
      setError('');
      try {
        const { data } = await axios.post(`${urlApi}auth/login`, values, {
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        });
        if (data.success === false) {
          setError(data.message);
        } else {
          const token = data.token ?? data.data?.token;
          login(token);
          navigate('/home', { replace: true });
        }
      } catch (err) {
        setError(err.response?.data?.message ?? 'Error al iniciar sessió');
      }
    },
  });

  return (
    <>
      <div className="position-relative p-2" style={{ zIndex: 1 }}>
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-md-6 col-lg-4 p-4">

            <form onSubmit={formik.handleSubmit} noValidate>
              {/* Email */}
              <div className="login-field mb-3">
                <label className="login-label form-label" htmlFor="email">
                  Correu electrònic
                </label>
                <div className="login-input-wrap">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className={`form-control${formik.touched.email && formik.errors.email ? ' is-invalid' : ''}`}
                    placeholder="nom@empresa.com"
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <span className="text-danger small">{formik.errors.email}</span>
                )}
              </div>

              {/* Password */}
              <div className="login-field mb-4">
                <div className="login-label-row">
                  <label className="login-label form-label" htmlFor="password">
                    Contrasenya
                  </label>
                </div>
                <div className="login-input-wrap">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className={`form-control${formik.touched.password && formik.errors.password ? ' is-invalid' : ''}`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <span className="text-danger small">{formik.errors.password}</span>
                )}
              </div>

              {error && <p className="text-danger small mb-3">{error}</p>}

              <button
                type="submit"
                className="tablon-btn-add d-flex align-items-center gap-2 border-0 rounded-2 px-3 py-2"
                style={{ fontSize: 13, cursor: 'pointer' }}
              >
                Iniciar sessió
              </button>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}
