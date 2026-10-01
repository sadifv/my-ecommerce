document.addEventListener('DOMContentLoaded', () => {
  // Actualizar badge del carrito en header
  actualizarCarrito();

  // Manejar el formulario de checkout si está en checkout.html
  const proceedBtn = document.getElementById('proceed-btn');
  if (proceedBtn) {
    proceedBtn.addEventListener('click', handleCheckout);
  }
});

function actualizarCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  
  // Actualizar badge en el header
  const cartLinks = document.querySelectorAll('#login-link + ul > li');
  cartLinks.forEach(link => {
    const badge = link.querySelector('.cart-badge');
    if (badge) {
      badge.textContent = total;
    }
  });

  // Habilitar/deshabilitar botón de proceder
  const proceedBtn = document.getElementById('proceed-btn');
  if (proceedBtn) {
    proceedBtn.disabled = total === 0;
  }
}

async function handleCheckout() {
  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  
  if (carrito.length === 0) {
    alert('El carrito está vacío');
    return;
  }

  const token = localStorage.getItem('jwtToken');
  if (!token) {
    alert('Debes iniciar sesión primero');
    window.location.href = 'login.html';
    return;
  }

  // Calcular total
  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  // Crear pedido
  const respuesta = await fetch('/api/pedidos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      productos: carrito.map(item => ({
        id: item.id,
        cantidad: item.cantidad
      })),
      total,
      direccion: 'Dirección por defecto' // En un caso real vendría del formulario
    })
  });

  if (respuesta.ok) {
    // Limpiar carrito
    localStorage.removeItem('carrito');
    actualizarCarrito();
    alert('Pedido completado exitosamente');
    window.location.href = '/';
  } else {
    const error = await respuesta.json();
    alert('Error al crear el pedido: ' + (error.msg || 'Error desconocido'));
  }
}