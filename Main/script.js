const date = new Date();
document.getElementById('current-date').textContent = date.toLocaleDateString('en-IN', {
  weekday: 'short',
  day: 'numeric',
  month: 'short'
});