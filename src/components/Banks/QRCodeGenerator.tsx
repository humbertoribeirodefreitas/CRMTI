import React, { useState } from 'react';
import { X, QrCode, Download, Copy, Check } from 'lucide-react';

interface Bank {
  id: string;
  name: string;
  pixKeys?: Array<{
    id: string;
    type: string;
    value: string;
  }>;
}

interface QRCodeGeneratorProps {
  bank: Bank;
  onClose: () => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ bank, onClose }) => {
  const [formData, setFormData] = useState({
    pixKey: '',
    amount: '',
    description: '',
    recipientName: 'Empresa CRM Técnico',
    recipientCity: 'São Paulo',
  });
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateQRCode = () => {
    if (!formData.pixKey) return;

    // Simulate QR Code generation (in a real app, you'd use a proper PIX QR code library)
    const pixData = {
      pixKey: formData.pixKey,
      amount: formData.amount ? parseFloat(formData.amount) : undefined,
      description: formData.description,
      recipientName: formData.recipientName,
      recipientCity: formData.recipientCity,
      timestamp: new Date().toISOString(),
    };

    // Generate a mock QR code data string
    const qrString = `PIX|${JSON.stringify(pixData)}`;
    setQrCodeData(qrString);
  };

  const copyQRCode = async () => {
    if (!qrCodeData) return;
    
    try {
      await navigator.clipboard.writeText(qrCodeData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = qrCodeData;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeData) return;
    
    try {
      // In a real implementation, you would generate an actual QR code image
      const element = document.createElement('a');
      const file = new Blob([qrCodeData], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `qr-code-pix-${bank.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(element.href);
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      alert('Erro ao fazer download do arquivo');
    }
  };

  const renderQRCodePreview = () => {
    if (!qrCodeData) return null;

    // Mock QR code visualization (in a real app, use a QR code library like qrcode.js)
    return (
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200 text-center">
        <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
          <div className="text-center">
            <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">QR Code PIX</p>
            <p className="text-xs text-gray-400 mt-1">
              {formData.amount ? `R$ ${parseFloat(formData.amount).toFixed(2)}` : 'Valor livre'}
            </p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Chave:</strong> {formData.pixKey}</p>
          <p><strong>Beneficiário:</strong> {formData.recipientName}</p>
          {formData.description && <p><strong>Descrição:</strong> {formData.description}</p>}
        </div>

        <div className="flex justify-center space-x-3 mt-4">
          <button
            onClick={copyQRCode}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
          
          <button
            onClick={downloadQRCode}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <QrCode className="w-5 h-5 mr-2" />
            Gerar QR Code PIX - {bank.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Chave PIX
              </label>
              <select
                value={formData.pixKey}
                onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione uma chave PIX</option>
                {bank.pixKeys?.map((key) => (
                  <option key={key.id} value={key.value}>
                    {key.type.toUpperCase()}: {key.value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor (opcional)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Deixe em branco para permitir que o pagador digite o valor
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição (opcional)
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do pagamento"
                maxLength={140}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome do Beneficiário
              </label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cidade do Beneficiário
              </label>
              <input
                type="text"
                value={formData.recipientCity}
                onChange={(e) => setFormData({ ...formData, recipientCity: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={generateQRCode}
              disabled={!formData.pixKey || !formData.recipientName || !formData.recipientCity}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>Gerar QR Code</span>
            </button>
          </div>

          {/* QR Code Preview */}
          <div>
            {qrCodeData ? (
              renderQRCodePreview()
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <QrCode className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">
                  Preencha os dados e clique em "Gerar QR Code" para visualizar
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;