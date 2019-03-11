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
  window.location.href = '/';
}
