// src/components/ProductoCard.jsx

function ProductoCard({ producto, onAgregar }) {
  const precioFormateado = producto.precio.toLocaleString('es-CO');

  return (
    <div style={estilos.tarjeta}>
      <img src={producto.imagen} alt={producto.nombre} style={estilos.imagen} />
      <div style={estilos.contenido}>
        <h3 style={estilos.nombre}>{producto.nombre}</h3>
        <p style={estilos.descripcion}>{producto.descripcion}</p>
        <p style={estilos.precio}>${precioFormateado} COP</p>
        <button style={estilos.boton} onClick={() => onAgregar(producto)}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

const estilos = {
  tarjeta: {
    backgroundColor: '#161616',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  imagen: {
    width: '100%',
    height: '260px',
    objectFit: 'cover',
  },
  contenido: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  nombre: {
    color: '#fff',
    fontSize: '15px',
    margin: '0 0 8px 0',
    fontFamily: "'Georgia', serif",
  },
  descripcion: {
    color: '#9a9a9a',
    fontSize: '12.5px',
    margin: '0 0 12px 0',
    flexGrow: 1,
  },
  precio: {
    color: '#d4af37',
    fontSize: '17px',
    fontWeight: 'bold',
    margin: '0 0 12px 0',
  },
  boton: {
    padding: '10px',
    backgroundColor: '#d4af37',
    color: '#0d0d0d',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '13px',
    cursor: 'pointer',
  },
};

export default ProductoCard;