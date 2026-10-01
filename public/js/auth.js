document.addEventListener('DOMContentLoaded', () => {
  const loginLink = document.getElementById('login-link');
  const adminLink = document.getElementById('admin-link');

  // Verificar si hay token en localStorage
  const token = localStorage.getItem('jwtToken');

  if (token) {
    // Usuario logado - mostrar opciones de usuario
    loginLink.textContent = 'Perfil';
    loginLink.href = 'profile.html';
    
    // Verificar rol de admin para mostrar panel
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.rol === 'admin') {
      adminLink.style.display = 'block';
    }
  } else {
    // Usuario no logado - mostrar login
    loginLink.textContent = 'Login';
    loginLink.href = 'login.html';
    adminLink.style.display = 'none';
  }
});