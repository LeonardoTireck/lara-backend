export function validateName(name: string) {
  const trimmed = name.trim().replace(/\s+/g, " ");
  const words = trimmed.split(" ");
  if (words.length < 2) return false;
  const nameRegex = /^[A-Za-zÀ-ÿ]+(['-]?[A-Za-zÀ-ÿ]+)*$/;
  return words.every((word) => nameRegex.test(word));
}
