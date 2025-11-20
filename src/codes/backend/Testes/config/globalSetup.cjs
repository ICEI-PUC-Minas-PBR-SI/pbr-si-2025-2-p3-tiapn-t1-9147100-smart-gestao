/**
 * =================================================================================
 * ARQUIVO: Testes/config/globalSetup.cjs
 *
 * DESCRIÇÃO:
 *            Este script é executado uma única vez ANTES de toda a suíte de testes.
 *            Sua responsabilidade é preparar o ambiente global para os testes,
 *            incluindo a conexão com o banco de dados, a criação de dados de teste
 *            (seeding) e a inicialização do servidor da API.
 * =================================================================================
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { initPermissions } = require('../../Scripts/initPermissions.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Company = require('../../models/Company.js').default;
const User = require('../../models/User.js').default;
const Permission = require('../../models/Permission.js').default;
const SessionToken = require('../../models/SessionToken.js').default;
const Client = require('../../models/Client.js').default;
const Transaction = require('../../models/Transaction.js').default;
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');

module.exports = async () => {
  console.log('\n--- 🚀 [GLOBAL SETUP] Iniciando ambiente de teste ---');

  // Carrega as variáveis de ambiente do arquivo .env
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });

  // Valida a existência da string de conexão do MongoDB
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('ERRO FATAL: A variável MONGO_URI não está definida no seu arquivo .env.');
  }

  // Conecta ao banco de dados e armazena a conexão em uma variável global
  const conn = await mongoose.connect(mongoUri);
  global.__MONGO_CONNECTION__ = conn;

  // Inicia o servidor da API PRIMEIRO para descobrir a porta correta.
  const serverModule = await import('../../server.js');
  const server = await serverModule.startServer({ dbUri: mongoUri, port: process.env.PORT || 5000 });

  // A lógica de limpeza foi removida daqui e centralizada no globalTeardown.
  // O setup agora apenas CRIA dados temporários, sem nunca destruir dados existentes.
  // Isso garante que os dados de desenvolvimento manual sejam preservados.

  // Garante que as permissões padrão existam no banco
  const cleanupIds = { companies: [], users: [], clients: [], transactions: [], permissions: [] };
  await initPermissions();

  // Busca a permissão de usuário padrão para associar aos novos usuários
  const passwordHash = await bcrypt.hash('password123', 10);
  const userPermission = await Permission.findOne({ name: 'USER_COMPANY' });

  if (!userPermission) {
    throw new Error("ERRO FATAL: A permissão 'USER_COMPANY' não foi encontrada após a inicialização. O teste não pode continuar.");
  }

  // Cria a Empresa A e o Usuário A para os testes
  const companyA = await Company.create({ 
    name: 'Empresa A de Teste', 
    cnpj: `00000000${Date.now()}`.slice(-14) 
  });
  const userA = await User.create({
    name: 'Usuário A',
    email: `usera_${Date.now()}@test.com`,
    passwordHash: passwordHash,
    companyId: companyA._id,
    role: userPermission._id,
  });
  cleanupIds.companies.push(companyA._id);
  cleanupIds.users.push(userA._id);

  // Cria a Empresa B e o Usuário B para os testes de multi-tenancy
  const companyB = await Company.create({ 
    name: 'Empresa B de Teste', 
    cnpj: `00000001${Date.now()}`.slice(-14) 
  });
  const userB = await User.create({
    name: 'Usuário B',
    email: `userb_${Date.now()}@test.com`,
    passwordHash: passwordHash,
    companyId: companyB._id,
    role: userPermission._id,
  });
  cleanupIds.companies.push(companyB._id);
  cleanupIds.users.push(userB._id);

  // Função auxiliar para gerar tokens JWT
  const generateToken = (userId, companyId) => {
    return jwt.sign({ userId, companyId }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
  };

  // Cria dados específicos (cliente e transação) para o teste de geração de relatórios (PDF)
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

  // Monta um objeto com todos os dados de setup, que será salvo em um arquivo JSON
  // para ser lido pelos arquivos de teste individuais.
  const setupData = {
    // Garante que a URL da API use a porta que foi efetivamente alocada pelo startServer,
    // que pode ser 5000, 5001, etc.
    apiUrl: `http://localhost:${process.env.PORT}/api`,
    companyA: {
      _id: companyA._id.toString(),
      name: companyA.name,
      userId: userA._id.toString(),
      email: userA.email,
      password: 'password123',
      token: generateToken(userA._id, companyA._id),
      testClient: { _id: testClientForReport._id.toString(), name: testClientForReport.name },
      testTransaction: { _id: testTransactionForReport._id.toString(), description: testTransactionForReport.description }
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

  // Salva os dados de setup em um arquivo para que os testes possam acessá-los.
  fs.writeFileSync(path.join(__dirname, '../test-setup.json'), JSON.stringify(setupData, null, 2));

  global.__TEST_CLEANUP_IDS__ = cleanupIds;
  global.__SERVER__ = server;
  global.__SERVER_MODULE__ = serverModule;

  console.log('--- ✅ [GLOBAL SETUP] Ambiente pronto e servidor iniciado ---');
};