document.addEventListener('DOMContentLoaded', () => {
  // Cargar productos dinámicamente
  cargarProductos();

  // Actualizar header dependiendo de login
  actualizarHeader();
});

async function cargarProductos() {
  try {
    const respuesta = await fetch('/api/productos');
    
    // Manejar respuesta no exitosa
    if (!respuesta.ok) {
      throw new Error('Error al comunicarse con el servidor');
    }
    
    const productos = await respuesta.json();
    
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    // Limpiar grid usando textContent en lugar de innerHTML
    grid.textContent = '';

    // Mostrar mensaje si no hay productos
    if (productos.length === 0) {
      const mensaje = document.createElement('article');
      mensaje.className = 'product-card';
      mensaje.textContent = 'No hay productos disponibles en este momento';
      grid.appendChild(mensaje);
      return;
    }

    productos.forEach(producto => {
      const card = document.createElement('article');
      card.className = 'product-card';
      
      // Crear nombre del producto
      const h3 = document.createElement('h3');
      h3.textContent = producto.nombre;
      card.appendChild(h3);
      
      // Crear precio
      const price = document.createElement('p');
      price.className = 'price';
      price.textContent = `$${producto.precio}`;
      card.appendChild(price);
      
      // Botón agregar al carrito
      const btn = document.createElement('button');
      btn.className = 'btn-agregar';
      btn.dataset.id = producto._id;
      btn.dataset.nombre = producto.nombre;
      btn.dataset.precio = producto.precio.toString();
      btn.textContent = 'Agregar al carrito';
      card.appendChild(btn);
      
      grid.appendChild(card);
    });

    // Agregar eventos a los botones de agregar
    document.querySelectorAll('.btn-agregar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        agregarAlCarrito(
          e.target.dataset.id,
          e.target.dataset.nombre,
          parseFloat(e.target.dataset.precio)
        );
      });
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
    
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    grid.textContent = '';
    const mensaje = document.createElement('article');
    mensaje.className = 'product-card';
    mensaje.textContent = 'Error al cargar productos. Por favor, inténtalo de nuevo más tarde.';
    grid.appendChild(mensaje);
  }
}

function actualizarHeader() {
  const token = localStorage.getItem('jwtToken');
  const loginLink = document.getElementById('login-link');
  const adminLink = document.getElementById('admin-link');

  if (!loginLink) return;

  if (token) {
    loginLink.textContent = 'Perfil';
    loginLink.href = 'profile.html';
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.rol === 'admin') {
      adminLink.style.display = 'block';
    } else {
      adminLink.style.display = 'none';
    }
  } else {
    loginLink.textContent = 'Login';
    loginLink.href = '/auth/login';
    adminLink.style.display = 'none';
  }
}

function agregarAlCarrito(id, nombre, precio) {
  // Obtener carrito actual de localStorage
  let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  
  // Verificar si el producto ya existe
  const indice = carrito.findIndex(item => item.id === id);
  if (indice >= 0) {
    carrito[indice].cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }
  
  // Guardar en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
  
  // Actualizar UI
  actualizarCarrito();
}

function actualizarCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  const cartBtn = document.querySelector('.cart-badge');
  if (cartBtn) {
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    cartBtn.textContent = total;
  }
}