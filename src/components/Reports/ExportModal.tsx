import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, Globe, FileText, Check } from 'lucide-react';
import { exportToCSV, exportToExcel, openInGoogleSheets, ExportData } from '../../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ExportData;
  title: string;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, data, title }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async (type: 'csv' | 'excel' | 'sheets') => {
    setIsExporting(true);
    setExportSuccess(null);

    try {
      let success = false;
      
      switch (type) {
        case 'csv':
          success = exportToCSV(data);
          if (success) setExportSuccess('CSV exportado com sucesso!');
          break;
        case 'excel':
          success = exportToExcel(data);
          if (success) setExportSuccess('Arquivo Excel exportado com sucesso!');
          break;
        case 'sheets':
          success = openInGoogleSheets(data);
          if (success) setExportSuccess('Dados enviados para Google Sheets!');
          break;
      }
    } catch (error) {
      console.error('Erro na exportação:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Exportar {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Escolha o formato de exportação para os dados:
          </div>

          {exportSuccess && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center">
              <Check className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 text-sm">{exportSuccess}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => handleExport('excel')}
              disabled={isExporting}
              className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                  <FileSpreadsheet className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Microsoft Excel</div>
                  <div className="text-sm text-gray-500">Arquivo .xls compatível com Excel</div>
                </div>
              </div>
              <Download className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => handleExport('sheets')}
              disabled={isExporting}
              className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Google Sheets</div>
                  <div className="text-sm text-gray-500">Abrir diretamente no Google Sheets</div>
                </div>
              </div>
              <Download className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">CSV</div>
                  <div className="text-sm text-gray-500">Arquivo de texto separado por vírgulas</div>
                </div>
              </div>
              <Download className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Dica:</strong> Para melhor compatibilidade com Excel brasileiro, 
              recomendamos usar a opção "Microsoft Excel\" que formata automaticamente 
              números e datas no padrão brasileiro.
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;