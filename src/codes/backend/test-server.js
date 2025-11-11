/**
 * =================================================================================
 * ARQUIVO: test-server.js
 * DESCRIÇÃO: Ponto de entrada do servidor Express para o ambiente de TESTE.
 *            Este script é uma variação do `server.js` principal, com uma diferença
 *            crucial: ele lê a string de conexão do banco de dados de um arquivo
 *            temporário, garantindo que ele se conecte ao banco de dados em memória
 *            criado pelo ambiente de teste do Jest, e não ao banco de produção.
 * =================================================================================
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

// Importa as rotas (o resto da lógica da aplicação é a mesma)
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import metaRoutes from './routes/metaRoutes.js';
// Adicione outras rotas aqui conforme necessário

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Lógica de conexão específica para o teste
const uriPath = path.resolve('.mongo-uri-test');

const waitForFile = (filePath, timeout = 30000) => {
  const start = Date.now();
  while (!fs.existsSync(filePath)) {
    if (Date.now() - start > timeout) {
      throw new Error(`Timeout: Arquivo ${filePath} não foi criado em ${timeout / 1000} segundos.`);
    }
    const waitTill = Date.now() + 100;
    while(Date.now() < waitTill) { /* busy-wait */ }
  }
};

try {
  console.log('\n--- 🚀 [ETAPA 2 de 4] Iniciando Servidor de Teste ---');
  console.log('   - [PROCESSO] Aguardando arquivo de configuração do banco de teste...');
  waitForFile(uriPath);
  console.log('   - [OK] Arquivo .mongo-uri-test encontrado.');
  const mongoUri = fs.readFileSync(uriPath, 'utf-8');

  // Conecta ao MongoDB em memória
  mongoose.connect(mongoUri)
    .then(() => console.log('   - [OK] Servidor de teste conectado ao banco de dados em memória.'))
    .catch(err => {
      console.error('❌ Falha ao conectar ao banco de teste em memória:', err);
      process.exit(1);
    });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/meta', metaRoutes);
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Inicia o servidor na porta padrão
// MOTIVO DA MUDANÇA: A porta do servidor de teste foi alterada para 5001 para evitar
// conflitos com o servidor de desenvolvimento principal, que roda na porta 5000.
const PORT = process.env.TEST_PORT || 5001;
app.listen(PORT, () => {
  console.log(`   - [OK] Servidor de teste escutando na porta ${PORT}. Aguardando testes...`);
});