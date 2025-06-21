const filters = ['nameFilter', 'emailFilter', 'amountFilter', 'dateFilter', 'countryFilter'];
filters.forEach(id => document.getElementById(id).addEventListener('input', filterRows));

function filterRows() {
  const name = document.getElementById('nameFilter').value.toLowerCase();
  const email = document.getElementById('emailFilter').value.toLowerCase();
  const amount = document.getElementById('amountFilter').value.toLowerCase();
  const date = document.getElementById('dateFilter').value.toLowerCase();
  const country = document.getElementById('countryFilter').value.toLowerCase();

  document.querySelectorAll('#paymentsBody tr').forEach(row => {
    const [nameTd, emailTd, amountTd, dateTd, countryTd] = row.children;
    const match =
      (!name || nameTd.textContent.toLowerCase().includes(name)) &&
      (!email || emailTd.textContent.toLowerCase().includes(email)) &&
      (!amount || amountTd.textContent.toLowerCase().includes(amount)) &&
      (!date || dateTd.textContent.toLowerCase().includes(date)) &&
      (!country || countryTd.textContent.toLowerCase().includes(country));
    row.style.display = match ? '' : 'none';
  });
}