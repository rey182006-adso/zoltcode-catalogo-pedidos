// src/pages/Historial.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Historial() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarPedidos() {
      try {
        const respuesta = await api.get('/pedidos');
        setPedidos(respuesta.data.pedidos);
      } catch (err) {
        setError('No se pudo cargar el historial de pedidos.');
      } finally {
        setCargando(false);
      }
    }
    cargarPedidos();
  }, []);

  function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  const colorEstado = {
    pendiente: '#e6b800',
    pagado: '#4caf50',
    cancelado: '#e57373',
  };

  return (
    <div style={estilos.pagina}>
      <header style={estilos.header}>
        <p style={estilos.marca}>KINGLUX <span style={estilos.marcaFina}>Casa Rey</span></p>
        <button style={estilos.botonVolver} onClick={() => navigate('/catalogo')}>
          ← Volver al catálogo
        </button>
      </header>

      <div style={estilos.contenido}>
        <h2 style={estilos.titulo}>Mis pedidos</h2>

        {cargando && <p style={estilos.mensaje}>Cargando pedidos...</p>}
        {error && <p style={estilos.mensajeError}>{error}</p>}

        {!cargando && !error && pedidos.length === 0 && (
          <p style={estilos.mensaje}>Todavía no tenés pedidos registrados.</p>
        )}

        {pedidos.map((pedido) => (
          <div key={pedido.id} style={estilos.tarjeta}>
            <div>
              <p style={estilos.pedidoId}>Pedido #{pedido.id.slice(0, 8)}</p>
              <p style={estilos.pedidoFecha}>{formatearFecha(pedido.fecha_creacion)}</p>
            </div>
            <div style={estilos.pedidoDerecha}>
              <span style={{ ...estilos.estado, color: colorEstado[pedido.estado_pago] || '#c9c9c9' }}>
                {pedido.estado_pago.toUpperCase()}
              </span>
              <p style={estilos.pedidoTotal}>${parseFloat(pedido.total).toLocaleString('es-CO')} COP</p>
            </div>
          </div>
        ))}
      </div>
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
  botonVolver: {
    padding: '8px 14px',
    backgroundColor: 'transparent',
    color: '#d4af37',
    border: '1px solid #d4af37',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  contenido: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '32px',
  },
  titulo: {
    color: '#fff',
    fontSize: '22px',
    marginBottom: '20px',
  },
  mensaje: {
    color: '#9a9a9a',
    textAlign: 'center',
    padding: '40px 0',
  },
  mensajeError: {
    color: '#e57373',
    textAlign: 'center',
    padding: '40px 0',
  },
  tarjeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#161616',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    padding: '16px 20px',
    marginBottom: '12px',
  },
  pedidoId: {
    color: '#fff',
    fontSize: '14px',
    margin: '0 0 4px 0',
  },
  pedidoFecha: {
    color: '#9a9a9a',
    fontSize: '12px',
    margin: 0,
  },
  pedidoDerecha: {
    textAlign: 'right',
  },
  estado: {
    fontSize: '11px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  pedidoTotal: {
    color: '#d4af37',
    fontSize: '15px',
    fontWeight: 'bold',
    margin: '4px 0 0 0',
  },
};

export default Historial;