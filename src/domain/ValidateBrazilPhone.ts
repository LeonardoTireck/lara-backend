export function validateBrazilPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");

  // Strip leading "55" country code
  const normalized = cleaned.startsWith("55") ? cleaned.substring(2) : cleaned;

  // Regex for Brazilian landline (10 digits) and mobile (11 digits with leading 9 after DDD)
  const landlineRegex = /^(?:[1-9]{2})(?:[2-5]\d{3}\d{4})$/;
  const mobileRegex = /^(?:[1-9]{2})(?:9\d{4}\d{4})$/;

  return landlineRegex.test(normalized) || mobileRegex.test(normalized);
}
