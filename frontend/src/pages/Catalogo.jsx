// src/pages/Catalogo.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { imagenesPorNombre } from '../data/imagenesProductos';
import ProductoCard from '../components/ProductoCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Catalogo() {
  const { usuario, logout } = useAuth();
  const { agregarProducto, totalItems } = useCart();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarProductos() {
      try {
        const respuesta = await api.get('/productos');
        setProductos(respuesta.data.productos);
      } catch (err) {
        setError('No se pudieron cargar los productos. Intenta de nuevo.');
      } finally {
        setCargando(false);
      }
    }
    cargarProductos();
  }, []);

  function manejarLogout() {
    logout();
    navigate('/');
  }

  return (
    <div style={estilos.pagina}>
      <header style={estilos.header}>
        <div>
          <p style={estilos.marca}>KINGLUX <span style={estilos.marcaFina}>Casa Rey</span></p>
        </div>
        <div style={estilos.usuarioInfo}>
          <span style={estilos.saludo}>Hola, {usuario?.nombre}</span>
          <button onClick={() => navigate('/historial')} style={estilos.botonSecundario}>
            Mis pedidos
          </button>
          <button onClick={() => navigate('/carrito')} style={estilos.botonCarrito}>
            Carrito ({totalItems})
          </button>
          <button onClick={manejarLogout} style={estilos.botonSalir}>Cerrar sesión</button>
        </div>
      </header>

      {cargando && <p style={estilos.mensaje}>Cargando productos...</p>}
      {error && <p style={estilos.mensajeError}>{error}</p>}

      {!cargando && !error && (
        <main style={estilos.grilla}>
          {productos.map((producto) => (
            <ProductoCard
              key={producto.id}
              producto={{
                ...producto,
                precio: parseFloat(producto.precio),
                imagen: imagenesPorNombre[producto.nombre],
              }}
              onAgregar={agregarProducto}
            />
          ))}
        </main>
      )}
    </div>
  );
}

const estilos = {
  pagina: {
    minHeight: '100vh',
    backgroundColor: '#0d0d0d',
    fontFamily: "'Georgia', serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 32px',
    borderBottom: '1px solid #2a2a2a',
  },
  marca: {
    color: '#d4af37',
    fontSize: '20px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    margin: 0,
  },
  marcaFina: {
    color: '#e8d9a0',
    fontStyle: 'italic',
    fontWeight: 'normal',
  },
  usuarioInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  saludo: {
    color: '#c9c9c9',
    fontSize: '13px',
    marginRight: '4px',
  },
  botonSecundario: {
    padding: '8px 14px',
    backgroundColor: 'transparent',
    color: '#c9c9c9',
    border: '1px solid #444',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  botonCarrito: {
    padding: '8px 14px',
    backgroundColor: '#d4af37',
    color: '#0d0d0d',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  botonSalir: {
    padding: '8px 14px',
    backgroundColor: 'transparent',
    color: '#d4af37',
    border: '1px solid #d4af37',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  mensaje: {
    color: '#c9c9c9',
    textAlign: 'center',
    padding: '60px',
  },
  mensajeError: {
    color: '#e57373',
    textAlign: 'center',
    padding: '60px',
  },
  grilla: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px',
    padding: '32px',
  },
};

export default Catalogo;