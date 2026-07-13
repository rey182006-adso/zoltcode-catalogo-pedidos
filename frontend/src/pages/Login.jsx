// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarSubmit(e) {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await login(email, password);
      navigate('/catalogo');
    } catch (err) {
      const mensaje = err.response?.data?.error || 'Error al iniciar sesion';
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={estilos.contenedorPagina}>
      <div style={estilos.tarjeta}>
        <p style={estilos.marca}>KINGLUX</p>
        <p style={estilos.subMarca}>Casa Rey</p>
        <p style={estilos.lema}>Donde el oro es rey</p>

        <h2 style={estilos.titulo}>Iniciar sesión</h2>

        <form onSubmit={manejarSubmit}>
          <div style={estilos.campo}>
            <label style={estilos.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={estilos.input}
            />
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={estilos.input}
            />
          </div>

          {error && <p style={estilos.error}>{error}</p>}

          <button type="submit" disabled={cargando} style={estilos.boton}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const estilos = {
  contenedorPagina: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d0d0d',
    fontFamily: "'Georgia', serif",
  },
  tarjeta: {
    width: '380px',
    padding: '40px 32px',
    backgroundColor: '#161616',
    border: '1px solid #d4af37',
    borderRadius: '8px',
    textAlign: 'center',
  },
  marca: {
    fontSize: '32px',
    fontWeight: 'bold',
    letterSpacing: '4px',
    color: '#d4af37',
    margin: 0,
  },
  subMarca: {
    fontSize: '16px',
    color: '#e8d9a0',
    margin: '2px 0 0 0',
    fontStyle: 'italic',
  },
  lema: {
    fontSize: '12px',
    color: '#9a9a9a',
    margin: '4px 0 28px 0',
    fontStyle: 'italic',
  },
  titulo: {
    color: '#ffffff',
    fontSize: '18px',
    marginBottom: '20px',
    fontWeight: 'normal',
  },
  campo: {
    marginBottom: '16px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    color: '#c9c9c9',
    fontSize: '13px',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#0d0d0d',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  error: {
    color: '#e57373',
    fontSize: '13px',
    marginBottom: '12px',
  },
  boton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#d4af37',
    color: '#0d0d0d',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '8px',
  },
};

export default Login;