// src/pages/Carrito.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

function Carrito() {
  const { items, cambiarCantidad, quitarProducto, vaciarCarrito, totalPrecio } = useCart();
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(null);

  async function confirmarPedido() {
    setError('');
    setEnviando(true);

    try {
      const body = {
        items: items.map((i) => ({ producto_id: i.id, cantidad: i.cantidad })),
      };
      const respuesta = await api.post('/pedidos', body);
      setExito(respuesta.data.pedido);
      vaciarCarrito();
    } catch (err) {
      const mensaje = err.response?.data?.error || 'Error al crear el pedido';
      setError(mensaje);
    } finally {
      setEnviando(false);
    }
  }

  if (exito) {
    return (
      <div style={estilos.pagina}>
        <div style={estilos.confirmacion}>
          <h2 style={estilos.tituloConfirmacion}>¡Pedido confirmado!</h2>
          <p style={estilos.textoConfirmacion}>
            Tu pedido <strong>#{exito.id.slice(0, 8)}</strong> quedó registrado por un total de{' '}
            <strong>${parseFloat(exito.total).toLocaleString('es-CO')} COP</strong>.
          </p>
          <button style={estilos.botonDorado} onClick={() => navigate('/catalogo')}>
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={estilos.pagina}>
      <header style={estilos.header}>
        <p style={estilos.marca}>KINGLUX <span style={estilos.marcaFina}>Casa Rey</span></p>
        <button style={estilos.botonVolver} onClick={() => navigate('/catalogo')}>
          ← Volver al catálogo
        </button>
      </header>

      <div style={estilos.contenido}>
        <h2 style={estilos.titulo}>Tu carrito</h2>

        {items.length === 0 && (
          <p style={estilos.vacio}>Tu carrito está vacío. Volvé al catálogo para agregar productos.</p>
        )}

        {items.map((item) => (
          <div key={item.id} style={estilos.item}>
            <img src={item.imagen} alt={item.nombre} style={estilos.itemImagen} />
            <div style={estilos.itemInfo}>
              <p style={estilos.itemNombre}>{item.nombre}</p>
              <p style={estilos.itemPrecio}>${item.precio.toLocaleString('es-CO')} COP c/u</p>
            </div>
            <div style={estilos.itemCantidad}>
              <button style={estilos.botonCantidad} onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}>-</button>
              <span style={estilos.numeroCantidad}>{item.cantidad}</span>
              <button style={estilos.botonCantidad} onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}>+</button>
            </div>
            <p style={estilos.itemSubtotal}>${(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
            <button style={estilos.botonQuitar} onClick={() => quitarProducto(item.id)}>Quitar</button>
          </div>
        ))}

        {items.length > 0 && (
          <div style={estilos.resumen}>
            <p style={estilos.total}>Total: ${totalPrecio.toLocaleString('es-CO')} COP</p>
            {error && <p style={estilos.error}>{error}</p>}
            <button style={estilos.botonDorado} onClick={confirmarPedido} disabled={enviando}>
              {enviando ? 'Procesando...' : 'Confirmar pedido'}
            </button>
          </div>
        )}
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
  vacio: {
    color: '#9a9a9a',
    textAlign: 'center',
    padding: '40px 0',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    backgroundColor: '#161616',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '12px',
  },
  itemImagen: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  itemInfo: {
    flexGrow: 1,
  },
  itemNombre: {
    color: '#fff',
    fontSize: '13.5px',
    margin: '0 0 4px 0',
  },
  itemPrecio: {
    color: '#9a9a9a',
    fontSize: '12px',
    margin: 0,
  },
  itemCantidad: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  botonCantidad: {
    width: '26px',
    height: '26px',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  numeroCantidad: {
    color: '#fff',
    fontSize: '13px',
    minWidth: '18px',
    textAlign: 'center',
  },
  itemSubtotal: {
    color: '#d4af37',
    fontSize: '13.5px',
    fontWeight: 'bold',
    minWidth: '80px',
    textAlign: 'right',
  },
  botonQuitar: {
    background: 'none',
    border: 'none',
    color: '#e57373',
    fontSize: '11.5px',
    cursor: 'pointer',
  },
  resumen: {
    marginTop: '24px',
    textAlign: 'right',
  },
  total: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  error: {
    color: '#e57373',
    fontSize: '13px',
    marginBottom: '12px',
  },
  botonDorado: {
    padding: '12px 24px',
    backgroundColor: '#d4af37',
    color: '#0d0d0d',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
  },
  confirmacion: {
    maxWidth: '500px',
    margin: '100px auto',
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#161616',
    border: '1px solid #d4af37',
    borderRadius: '8px',
  },
  tituloConfirmacion: {
    color: '#d4af37',
    fontSize: '22px',
    marginBottom: '12px',
  },
  textoConfirmacion: {
    color: '#c9c9c9',
    fontSize: '14px',
    marginBottom: '24px',
    lineHeight: 1.6,
  },
};

export default Carrito;