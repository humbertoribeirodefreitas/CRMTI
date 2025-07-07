export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  filename: string;
}

export const exportToCSV = (data: ExportData) => {
  try {
    // Create CSV content
    const csvContent = [
      data.headers.join(','),
      ...data.rows.map(row => 
        row.map(cell => {
          // Handle cells that contain commas, quotes, or newlines
          const cellStr = String(cell);
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(',')
      )
    ].join('\n');

    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${data.filename}.csv`);
    link.style.visibility = 'hidden';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Arquivo ${data.filename}.csv exportado com sucesso!`);
    return true;
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    alert('Erro ao exportar arquivo. Tente novamente.');
    return false;
  }
};

export const exportToExcel = (data: ExportData) => {
  try {
    // Create Excel-compatible CSV with proper formatting
    const excelContent = [
      data.headers.join('\t'), // Use tabs for better Excel compatibility
      ...data.rows.map(row => 
        row.map(cell => {
          const cellStr = String(cell);
          // Format numbers properly for Excel
          if (typeof cell === 'number') {
            return cellStr;
          }
          // Handle text with special characters
          if (cellStr.includes('\t') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join('\t')
      )
    ].join('\n');

    // Create blob with Excel MIME type
    const blob = new Blob(['\uFEFF' + excelContent], { 
      type: 'application/vnd.ms-excel;charset=utf-8;' 
    });
    
    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${data.filename}.xls`);
    link.style.visibility = 'hidden';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Arquivo ${data.filename}.xls exportado com sucesso!`);
    return true;
  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    alert('Erro ao exportar arquivo. Tente novamente.');
    return false;
  }
};

export const openInGoogleSheets = (data: ExportData) => {
  try {
    // Create CSV content for Google Sheets
    const csvContent = [
      data.headers.join(','),
      ...data.rows.map(row => 
        row.map(cell => {
          const cellStr = String(cell);
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(',')
      )
    ].join('\n');

    // Encode the CSV content
    const encodedContent = encodeURIComponent(csvContent);
    
    // Create Google Sheets import URL
    const googleSheetsUrl = `https://docs.google.com/spreadsheets/create?usp=sheets_web_upa_url&t=${data.filename}&csv=${encodedContent}`;
    
    // Open in new tab
    window.open(googleSheetsUrl, '_blank');
    
    console.log(`Dados enviados para Google Sheets: ${data.filename}`);
    return true;
  } catch (error) {
    console.error('Erro ao abrir Google Sheets:', error);
    alert('Erro ao abrir Google Sheets. Tente novamente.');
    return false;
  }
};

// Utility function to format currency values for export
export const formatCurrencyForExport = (value: number): string => {
  return value.toFixed(2).replace('.', ','); // Brazilian format
};

// Utility function to format date for export
export const formatDateForExport = (date: Date): string => {
  return date.toLocaleDateString('pt-BR');
};

// Utility function to format datetime for export
export const formatDateTimeForExport = (date: Date): string => {
  return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR')}`;
};