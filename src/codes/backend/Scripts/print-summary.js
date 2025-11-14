/**
 * =================================================================================
 * ARQUIVO: Scripts/print-summary.js
 * DESCRIÇÃO: Script utilitário para exibir um bloco de resumo formatado no console
 *            com os links de acesso para todos os serviços da aplicação. É chamado
 *            pelo `package.json` após todos os servidores terem sido iniciados
 *            com sucesso, servindo como um "painel de controle" amigável para o
 *            desenvolvedor.
 * =================================================================================
 */

// Usando template literals para uma formatação mais limpa e legível.
const summary = `
=================================================
    ✅ SISTEMA DISPONÍVEL PARA ACESSO:
=================================================
   - Backend (API):          http://localhost:5000
   - Verificação de Saúde:   http://localhost:5000/api/health
   - Frontend (Legado):      http://localhost:3000
   - Frontend (React Demo):  http://localhost:3001
=================================================
`;

console.log(summary);