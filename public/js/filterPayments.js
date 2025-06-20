const filters = ['dateFilter', 'serviceFilter', 'statusFilter'];
filters.forEach(id => document.getElementById(id).addEventListener('input', filterRows));

function filterRows() {
  const date = document.getElementById('dateFilter').value.toLowerCase();
  const service = document.getElementById('serviceFilter').value.toLowerCase();
  const status = document.getElementById('statusFilter').value.toLowerCase();

  document.querySelectorAll('#paymentsBody tr').forEach(row => {
    const [s, , d, st] = row.children;
    const match = (!date || d.textContent.includes(date)) &&
                  (!service || s.textContent.toLowerCase().includes(service)) &&
                  (!status || st.textContent.toLowerCase().includes(status));
    row.style.display = match ? '' : 'none';
  });
}