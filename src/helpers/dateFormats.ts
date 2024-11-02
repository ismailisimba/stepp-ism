export function formatAsShortDate(date: any) {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short", // "Apr"
      day: "numeric", // "1"
      year: "numeric", // "2025"
    }).format(new Date(date));
  } catch (error) {
    return date;
  }
}

export function formatDateToYMD(date: any) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return [year, month, day].join("-");
  //return `${year}-${month}-${day}`;
}

export function datePickerFormat(date: Date) {
  if (!date) return "";
  return formatDateToYMD(date);
}

export function dateFormFormat(date: Date) {
  if (!date) return "";
  return date.toISOString().substring(0, 10);
}
