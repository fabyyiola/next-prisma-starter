export function createDateFromYYYYMMDD(dateString: string): Date {
  const year = parseInt(dateString.slice(0, 4), 10);
  const month = parseInt(dateString.slice(5, 7), 10) - 1; // Months are 0-based in JS Date
  const day = parseInt(dateString.slice(8, 10), 10);
  return new Date(year, month, day);
}

export function convertToISO8601(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString();
}