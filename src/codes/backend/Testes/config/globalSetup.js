/**
 * =================================================================================
 * ARQUIVO: Testes/config/globalSetup.js
 *
 * DESCRIÇÃO:
 *            Este script é executado uma única vez ANTES de toda a suíte de testes.
 *            Sua responsabilidade é preparar o ambiente global para os testes,
 *            incluindo a conexão com o banco de dados, a criação de dados de teste
 *            (seeding) e a inicialização do servidor da API.
 * =================================================================================
 */
import mongoose from 'mongoose';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Company from '../../models/Company.js';
import User from '../../models/User.js';
import Permission from '../../models/Permission.js';
import SessionToken from '../../models/SessionToken.js';
import Client from '../../models/Client.js';
import Transaction from '../../models/Transaction.js';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async () => {
  console.log('\n--- 🚀 [GLOBAL SETUP] Iniciando ambiente de teste ---');
  
  // Carrega variáveis de ambiente
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('ERRO FATAL: A variável MONGO_URI não está definida no seu arquivo .env.');
  }

  // Conecta ao banco
  const conn = await mongoose.connect(mongoUri);
  global.__MONGO_CONNECTION__ = conn;

  // Objeto para armazenar os IDs dos dados que serão criados para limpeza posterior
  const cleanupIds = { companies: [], users: [], clients: [], transactions: [] };
  // Popula dados essenciais
  const existingPermissions = await Permission.countDocuments();
  if (existingPermissions === 0) {
    await Permission.create([
      { name: 'ROOT', description: 'Acesso total ao sistema.' },
      { name: 'ADMIN_COMPANY', description: 'Administrador da empresa.' },
      { name: 'USER_COMPANY', description: 'Usuário padrão da empresa.' },
    ]);
  }

  const passwordHash = await bcrypt.hash('password123', 10);
  const userPermission = await Permission.findOne({ name: 'USER_COMPANY' });

  const companyA = await Company.create({ 
    name: 'Empresa A de Teste', 
    // CNPJ único para evitar conflitos com dados manuais ou de testes anteriores
    cnpj: `00000000${Date.now()}`.slice(-14) 
  });
  const userA = await User.create({
    name: 'Usuário A',
    // Email único para evitar conflitos com dados manuais ou de testes anteriores
    email: `usera_${Date.now()}@test.com`,
    passwordHash: passwordHash,
    companyId: companyA._id,
    role: userPermission._id,
  });
  // Armazena os IDs para que o globalTeardown saiba exatamente o que apagar.
  cleanupIds.companies.push(companyA._id);
  cleanupIds.users.push(userA._id);

  const companyB = await Company.create({ 
    name: 'Empresa B de Teste', 
    // CNPJ único para evitar conflitos
    cnpj: `00000001${Date.now()}`.slice(-14) 
  });
  const userB = await User.create({
    name: 'Usuário B',
    // Email único para evitar conflitos
    email: `userb_${Date.now()}@test.com`,
    passwordHash: passwordHash,
    companyId: companyB._id,
    role: userPermission._id,
  });
  // Armazena os IDs para que o globalTeardown saiba exatamente o que apagar.
  cleanupIds.companies.push(companyB._id);
  cleanupIds.users.push(userB._id);

  const generateToken = (userId, companyId) => {
    return jwt.sign({ userId, companyId }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
  };

  const testClientForReport = await Client.create({
    companyId: companyA._id,
    name: `Cliente PDF ${faker.person.lastName()}`,
    email: faker.internet.email(),
    type: 'client'
  });
  cleanupIds.clients.push(testClientForReport._id);

  const testTransactionForReport = await Transaction.create({
    companyId: companyA._id,
    userId: userA._id,
    clientId: testClientForReport._id,
    description: 'Serviço de Consultoria para Fatura PDF',
    amount: 1250.75,
    type: 'revenue',
    date: new Date(),
    status: 'completed',
    paymentMethod: 'pix'
  });
  cleanupIds.transactions.push(testTransactionForReport._id);

  const setupData = {
    apiUrl: `http://localhost:${process.env.PORT || 5000}/api`,
    companyA: {
      _id: companyA._id.toString(),
      name: companyA.name,
      userId: userA._id.toString(),
      email: userA.email,
      password: 'password123',
      token: generateToken(userA._id, companyA._id),
      testClient: { _id: testClientForReport._id.toString(), name: testClientForReport.name },
      testTransaction: { _id: testTransactionForReport._id.toString(), description: testTransactionForReport.description },
    },
    companyB: {
      _id: companyB._id.toString(),
      name: companyB.name,
      userId: userB._id.toString(),
      email: userB.email,
      password: 'password123',
      token: generateToken(userB._id, companyB._id),
    },
  };

  fs.writeFileSync(path.join(__dirname, '../test-setup.json'), JSON.stringify(setupData, null, 2));

  // Inicia o servidor
  const serverModule = await import('../../server.js');
  const server = await serverModule.startServer({ dbUri: mongoUri, port: process.env.PORT || 5000 });
  
  // Armazena a lista de IDs e as referências do servidor em variáveis globais.
  // O Jest garante que essas variáveis estarão disponíveis para o script globalTeardown.
  global.__TEST_CLEANUP_IDS__ = cleanupIds;
  global.__SERVER__ = server;
  global.__SERVER_MODULE__ = serverModule;

  console.log('--- ✅ [GLOBAL SETUP] Ambiente pronto e servidor iniciado ---');
};