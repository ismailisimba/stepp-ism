export const camelCase = (value: string) => {
  return value
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
};

export const firstLetterLowerCase = (value: string) => {
  return value.charAt(0).toLowerCase() + value.slice(1);
};

export const firstLetterUpperCase = (value: string) => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const capitalizeWords = (str: string) => {
  return str
    .toLowerCase() // Optional: First, convert the entire string to lowercase
    .split(" ") // Split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(" "); // Join the words back into a single string
};

export const permsNameHelper = (str: string) => {
  return firstLetterLowerCase(capitalizeWords(str.trim().replace(/[^a-zA-Z0-9]/g, ' ')).replace(/\s+/g, ""));
};
