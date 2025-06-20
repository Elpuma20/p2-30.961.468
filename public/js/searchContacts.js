document.getElementById('search').addEventListener('input', function () {
  const value = this.value.toLowerCase();
  document.querySelectorAll('#contactsBody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(value) ? '' : 'none';
  });
});