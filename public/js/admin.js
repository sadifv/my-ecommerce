document.addEventListener('DOMContentLoaded', () => {
  // Verificar autenticación y rol de admin
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    // Si no hay token, redirigir al inicio
    window.location.href = '/index.html';
    return;
  }

  // Decodificar token para verificar rol
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.rol !== 'admin') {
      // Si no es admin, redirigir al inicio
      window.location.href = '/index.html';
    }
  } catch (error) {
    console.error('Error al decodificar token:', error);
    window.location.href = '/index.html';
  }

  // Cargar datos del admin
  cargarDatosAdmin();

  // Configurar eventos de producto CRUD
  configurarEventosProducto();
});

async function cargarDatosAdmin() {
  try {
    const respuesta = await fetch('/api/pedidos', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    });
    const pedidos = await respuesta.json();

    const adminContent = document.getElementById('admin-content');
    if (!adminContent) return;

    // Limpiar contenido usando textContent en lugar de innerHTML
    adminContent.textContent = '';

    // Crear tabla de pedidos de forma segura
    const h3 = document.createElement('h3');
    h3.textContent = 'Pedidos Recientes';
    adminContent.appendChild(h3);

    const table = document.createElement('table');
    table.className = 'tabla-productos';

    // Crear encabezado
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = ['ID', 'Usuario', 'Total', 'Estado', 'Fecha'];
    headers.forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Crear cuerpo de tabla
    const tbody = document.createElement('tbody');

    pedidos.forEach(pedido => {
      const tr = document.createElement('tr');

      const tdId = document.createElement('td');
      tdId.textContent = pedido._id || '';
      tr.appendChild(tdId);

      const tdUsuario = document.createElement('td');
      tdUsuario.textContent = pedido.usuario && pedido.usuario.nombre ? pedido.usuario.nombre : 'N/A';
      tr.appendChild(tdUsuario);

      const tdTotal = document.createElement('td');
      tdTotal.textContent = `$${pedido.total}`;
      tr.appendChild(tdTotal);

      const tdEstado = document.createElement('td');
      tdEstado.textContent = pedido.estado || 'pendiente';
      tr.appendChild(tdEstado);

      const tdFecha = document.createElement('td');
      tdFecha.textContent = new Date(pedido.createdAt).toLocaleDateString();
      tr.appendChild(tdFecha);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    adminContent.appendChild(table);
  } catch (error) {
    console.error('Error al cargar datos del admin:', error);

    const adminContent = document.getElementById('admin-content');
    if (!adminContent) return;

    // Mostrar error de forma segura
    const errorParrafo = document.createElement('p');
    errorParrafo.textContent = 'Error al cargar los datos';
    adminContent.appendChild(errorParrafo);
  }
}

// Funciones para CRUD de productos
const BASE_URL = '/api/productos';

async function fetchProductos() {
  const respuesta = await fetch(BASE_URL);
  if (!respuesta.ok) throw new Error('Error al cargar productos');
  return await respuesta.json();
}

async function crearProducto(productoData) {
  const respuesta = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    },
    body: JSON.stringify(productoData)
  });

  if (!respuesta.ok) throw new Error('Error al crear producto');
  return await respuesta.json();
}

async function actualizarProducto(id, productoData) {
  const respuesta = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    },
    body: JSON.stringify(productoData)
  });

  if (!respuesta.ok) throw new Error('Error al actualizar producto');
  return await respuesta.json();
}

async function eliminarProducto(id) {
  const respuesta = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    }
  });

  if (!respuesta.ok) throw new Error('Error al eliminar producto');
  return true;
}

// Configurar eventos en el DOM para CRUD de productos
async function configurarEventosProducto() {
  const adminContent = document.getElementById('admin-content');
  if (!adminContent) return;

  // Formulario de producto (se insertará dinámicamente)
  const formContainer = document.createElement('section');
  formContainer.className = 'form-producto';
  adminContent.appendChild(formContainer);

  const form = document.createElement('form');
  formContainer.appendChild(form);

  // Campos del formulario
  const campos = ['nombre', 'precio', 'stock'];
  campos.forEach(campo => {
    const div = document.createElement('section');
    const label = document.createElement('label');
    label.textContent = campo.charAt(0).toUpperCase() + campo.slice(1);
    label.htmlFor = campo;
    div.appendChild(label);

    const input = document.createElement('input');
    input.type = campo === 'precio' || campo === 'stock' ? 'number' : 'text';
    input.name = campo;
    input.required = true;
    div.appendChild(input);

    form.appendChild(div);
  });

  const btnGuardar = document.createElement('button');
  btnGuardar.type = 'submit';
  btnGuardar.textContent = 'Guardar Producto';
  form.appendChild(btnGuardar);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
      nombre: form.nombre.value,
      precio: parseFloat(form.precio.value),
      stock: parseInt(form.stock.value)
    };

    try {
      await crearProducto(datos);
      alert('Producto creado exitosamente');
      cargarDatosAdmin();
      form.reset();
    } catch (error) {
      alert(error.message);
    }
  });

  // Botón para limpiar formulario
  const btnLimpiar = document.createElement('button');
  btnLimpiar.type = 'button';
  btnLimpiar.textContent = 'Cancelar';
  btnLimpiar.addEventListener('click', () => form.reset());
  formContainer.appendChild(btnLimpiar);

  // Listar productos existentes
  await listarProductosTabla();

  // Configurar botones de eliminar para cada producto
  await cargarProductosParaEliminar();
}

async function listarProductosTabla() {
  const adminContent = document.getElementById('admin-content');
  if (!adminContent) return;

  const productos = await fetchProductos();

  const sectionTabla = document.createElement('section');
  sectionTabla.className = 'tabla-productos-container';
  adminContent.appendChild(sectionTabla);

  const h4 = document.createElement('h4');
  h4.textContent = 'Productos Registrados';
  sectionTabla.appendChild(h4);

  const table = document.createElement('table');
  sectionTabla.appendChild(table);

  // Crear encabezado
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  const headers = ['Nombre', 'Precio', 'Stock', 'Acciones'];
  headers.forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Crear cuerpo
  const tbody = document.createElement('tbody');

  productos.forEach(producto => {
    const tr = document.createElement('tr');

    const tdNombre = document.createElement('td');
    tdNombre.textContent = producto.nombre;
    tr.appendChild(tdNombre);

    const tdPrecio = document.createElement('td');
    tdPrecio.textContent = `$${producto.precio}`;
    tr.appendChild(tdPrecio);

    const tdStock = document.createElement('td');
    tdStock.textContent = producto.stock;
    tr.appendChild(tdStock);

    const tdAcciones = document.createElement('td');

    // Botón Editar
    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.className = 'btn-accion editar';
    btnEditar.addEventListener('click', () => {
      // Rellenar formulario con datos del producto
      form.nombre.value = producto.nombre;
      form.precio.value = producto.precio;
      form.stock.value = producto.stock;
      // Cambiar texto del botón
      btnGuardar.textContent = 'Actualizar Producto';
      // Guardar ID para actualizar
      form.dataset.id = producto._id;
      form.dataset.accion = 'actualizar';
    });
    tdAcciones.appendChild(btnEditar);

    // Botón Eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'btn-accion eliminar';
    btnEliminar.addEventListener('click', async () => {
      if (confirm('¿Seguro que deseas eliminar este producto?')) {
        try {
          await eliminarProducto(producto._id);
          alert('Producto eliminado');
          cargarDatosAdmin();
        } catch (error) {
          alert(error.message);
        }
      }
    });
    tdAcciones.appendChild(btnEliminar);
  });

  tbody.appendChild(tr);
  table.appendChild(tbody);
}