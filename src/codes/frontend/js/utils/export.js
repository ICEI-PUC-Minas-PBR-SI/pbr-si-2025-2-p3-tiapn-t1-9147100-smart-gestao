/**
 * @file Script para funcionalidades de exportação.
 * @description Adiciona a lógica para botões de exportação (ex: PDF, CSV)
 * que chamam a API para gerar e baixar arquivos.
 */

import { apiRequest } from '../api/apiHelper.js';

document.addEventListener('DOMContentLoaded', () => {
  // Assumimos que existe um botão com este ID na página de relatórios ou transações
  const exportPdfButton = document.querySelector('#export-pdf-btn');

  if (exportPdfButton) {
    exportPdfButton.addEventListener('click', handleExportToPdf);
  }

  /**
   * Manipula a exportação de um relatório para PDF.
   */
  async function handleExportToPdf() {
    const originalText = exportPdfButton.textContent;
    exportPdfButton.disabled = true;
    exportPdfButton.textContent = 'Gerando...';

    try {
      // Chama o endpoint da API que gera o PDF.
      // O backend deve retornar o arquivo PDF como um 'blob'.
      const response = await apiRequest('/reports/export/pdf', { method: 'GET' });

      if (!response.ok) throw new Error('Falha ao gerar o relatório em PDF.');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-smart-gestao-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Erro ao exportar para PDF:', error);
      alert(error.message);
    } finally {
      exportPdfButton.disabled = false;
      exportPdfButton.textContent = originalText;
    }
  }
});