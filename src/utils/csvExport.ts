export const downloadCSV = <T extends object>(data: T[], filename: string) => {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Get headers from the first object keys
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header as keyof T];
        // Handle strings with commas or newlines, and null/undefined
        const stringValue = value === null || value === undefined ? '' : String(value);
        const escapedValue = stringValue.replace(/"/g, '""'); // Escape double quotes
        return `"${escapedValue}"`;
      }).join(',')
    )
  ].join('\n');

  // Create a Blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};