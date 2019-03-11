function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function setToken(token) {
  return localStorage.setItem('token', token);
}

function getToken(token) {
  return localStorage.getItem('token');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.href = '/';
}

function getUserRole() {
  return localStorage.getItem('role');

}

function setUserRole(role) {
  return localStorage.setItem('role', role);
}
