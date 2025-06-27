export function formatCurrency(value: number, locale: string): string {
  const currency = locale === 'en' ? 'USD' : 'VES';
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-VE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(value);
}

export function formatDate(date: Date, locale: string): string {
  return date.toLocaleString(locale === 'en' ? 'en-US' : 'es-VE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: locale === 'en'
  });
}