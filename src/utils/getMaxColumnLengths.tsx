import { TableRow } from "@/components/TableExt";

export default function getMaxColumnLengths(rows: TableRow[]): { [key: string]: number } {
  // Initialize an empty object to store the max lengths
  const maxLengths: { [key: string]: number } = {};

  // Loop through each row in the array
  rows.forEach(row => {
    // Loop through each cell in the row
    row.cells.forEach(cell => {
      const { colName, value } = cell;

      // Update the max length for the column if necessary
      if (!maxLengths[colName] || value.length > maxLengths[colName]) {
        maxLengths[colName] = value.length;
      }
    });
  });

  return maxLengths;
}