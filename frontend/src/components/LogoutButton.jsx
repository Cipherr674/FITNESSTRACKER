const handleLogout = () => {
  sessionStorage.removeItem('token');
  
  // Clear browser history
  window.history.replaceState(null, '', '/');
  
  // Force reload to clear any cached state
  window.location.href = '/';
  
  // Optional: Clear all caches
  if ('caches' in window) {
    caches.keys().then(names => names.forEach(name => caches.delete(name)));
  }
}; 