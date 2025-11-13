/**
 * =================================================================================
 * ARQUIVO: Testes/config/mongo-test-environment.js
 *
 * MOTIVO DA CRIAÇÃO:
 * Este arquivo define um ambiente de teste personalizado para o Jest, resolvendo
 * problemas críticos como "condição de corrida" (race condition) e compartilhamento
 * de estado entre diferentes fases do teste.
 *
 * DESCRIÇÃO:
 *            Esta classe gerencia o ciclo de vida completo do ambiente de teste.
 *            Ela conecta ao banco de dados, limpa as coleções, popula com dados essenciais,
 *            inicia o servidor da API e, ao final de tudo, desliga o servidor e a conexão
 *            todos os testes, garantindo um ambiente de banco de dados limpo e
 *            isolado para cada execução da suíte de testes.
 * =================================================================================
 */
import NodeEnvironment from 'jest-environment-node';
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

const __dirname = dirname(fileURLToPath(import.meta.url));

class MongoTestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  /**
   * Executado antes de todos os testes. Inicia o servidor MongoDB em memória.
   */
  async setup() {
    await super.setup();
    console.log('\n--- 🚀 [ETAPA 1 de 4] Iniciando Ambiente de Teste (Jest Environment) ---');
    console.log('   - [PROCESSO] Lendo configuração do banco de dados de teste...');

    // MOTIVO DA MUDANÇA: Conforme solicitado, estamos forçando o uso do banco de dados PRINCIPAL para os testes.
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('ERRO FATAL: A variável MONGO_URI não está definida no seu arquivo .env. Esta variável é necessária para os testes.');
    }
    console.log('   - [ATENÇÃO] Usando banco de dados de DESENVOLVIMENTO para os testes. As coleções serão limpas.');

    // Expõe a URI para que o `server.js` também se conecte ao banco correto durante os testes.
    this.global.process.env.MONGO_URI_TEST = mongoUri;

    // Conecta, limpa e popula o banco de dados.
    // MOTIVO DA MUDANÇA: A lógica de setup foi movida do `test-setup.js` para cá, garantindo a ordem correta de execução.
    console.log('\n--- 🚀 [ETAPA 2 de 4] Limpando e populando o banco de dados de TESTE ---');
    const conn = await mongoose.connect(mongoUri);
    this.global.mongooseConnection = conn; // Salva a instância da conexão

    // Limpa apenas as coleções que serão usadas nos testes.
    await Promise.all([
      User.deleteMany({}),
      Company.deleteMany({}),
      SessionToken.deleteMany({}),
      Permission.deleteMany({}),
      Transaction.deleteMany({})
    ]);

    // Cria as permissões essenciais que o sistema precisa para funcionar.
    // Sem essas permissões, a criação de usuários nos testes falharia.
    await Permission.create([
        { name: 'ROOT', description: 'Acesso total ao sistema.' },
        { name: 'ADMIN_COMPANY', description: 'Administrador da empresa.' },
        { name: 'USER_COMPANY', description: 'Usuário padrão da empresa.' }
    ]);

    // --- GERAÇÃO DE DADOS DE TESTE (SEEDING) ---
    // Cria duas empresas (A e B) e um usuário para cada uma.
    // Isso é fundamental para os testes de isolamento de dados (multi-tenant),
    // onde verificamos se um usuário da Empresa A não pode acessar dados da Empresa B.
    const passwordHash = await bcrypt.hash('password123', 10);
    const userPermission = await Permission.findOne({ name: 'USER_COMPANY' });

    const companyA = await Company.create({ name: 'Empresa A de Teste', cnpj: '00000000000001' });
    const userA = await User.create({
      name: 'Usuário A',
      email: 'usera@test.com',
      passwordHash: passwordHash,
      companyId: companyA._id,
      role: userPermission._id,
    });

    const companyB = await Company.create({ name: 'Empresa B de Teste', cnpj: '00000000000002' });
    const userB = await User.create({
      name: 'Usuário B',
      email: 'userb@test.com',
      passwordHash: passwordHash,
      companyId: companyB._id,
      role: userPermission._id,
    });

    // Função auxiliar para gerar tokens JWT para os usuários de teste.
    // O token é necessário para autenticar as requisições à API nos arquivos de teste.
    const generateToken = (userId, companyId) => {
      return jwt.sign({ userId, companyId }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
    };

    // Cria dados específicos (cliente e transação) para a Empresa A.
    // Estes dados são usados para validar funcionalidades como a geração de relatórios em PDF,
    // garantindo que há dados concretos para serem exportados.
    const testClientForReport = await Client.create({
      companyId: companyA._id,
      name: `Cliente PDF ${faker.person.lastName()}`,
      email: faker.internet.email(),
      type: 'client'
    });

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


    // --- CRIAÇÃO DO ARQUIVO DE SETUP (test-setup.json) ---
    // Os dados gerados (IDs, tokens, etc.) são salvos em um arquivo JSON.
    // Os arquivos de teste (.test.js) leem este JSON para obter as informações
    // necessárias para montar suas requisições (ex: ID do usuário, token de autenticação).
    const setupData = {
      apiUrl: `http://localhost:${process.env.PORT || 5000}/api`,
      companyA: {
        _id: companyA._id.toString(),
        name: companyA.name,
        userId: userA._id.toString(),
        email: userA.email,
        password: 'password123',
        token: generateToken(userA._id, companyA._id), // Token para o usuário da Empresa A
        // Adiciona os dados específicos de relatório ao setup para serem usados no teste de PDF
        testClient: {
          _id: testClientForReport._id.toString(),
          name: testClientForReport.name,
        },
        testTransaction: {
          _id: testTransactionForReport._id.toString(),
          description: testTransactionForReport.description,
        },
      },
      companyB: {
        _id: companyB._id.toString(),
        name: companyB.name,
        userId: userB._id.toString(),
        email: userB.email,
        password: 'password123',
        token: generateToken(userB._id, companyB._id), // Token para o usuário da Empresa B
      },
    };

    // `fs.writeFileSync` é usado para garantir que o arquivo seja completamente escrito
    // antes que qualquer teste tente lê-lo, eliminando a "race condition".
    fs.writeFileSync(path.join(__dirname, '../test-setup.json'), JSON.stringify(setupData, null, 2));
    console.log('   - [OK] Dados de teste (empresas e usuários) criados e salvos em test-setup.json.');

    // --- INICIALIZAÇÃO DO SERVIDOR DA API ---
    // O servidor é importado e iniciado programaticamente.
    // Isso é crucial por duas razões:
    // 1. Garante que o servidor só comece a rodar DEPOIS que o banco de dados estiver pronto.
    // 2. Permite que o Jest "mock" (substitua) módulos internos do servidor,
    //    o que é usado no teste de PDF para verificar se a função de geração foi chamada,
    //    sem de fato gerar um arquivo em disco.
    try {
      // Importa o módulo do servidor. Como o projeto usa ES Modules, usamos `await import()`.
      const serverModule = await import('../../server.js');
      // Salva a referência do módulo do servidor no escopo global para que possamos
      // chamar a função `stopServer` no método `teardown`.
      this.global._serverModule = serverModule;
      await serverModule.startServer({ dbUri: mongoUri, port: process.env.PORT || 5000 });
      console.log('   - [OK] Servidor iniciado em-processo para execução dos testes.');
    } catch (e) {
      console.error('Erro ao iniciar servidor em-processo para testes:', e.message);
      throw e;
    }
  }

  /**
   * Executado uma única vez APÓS todos os testes terem sido concluídos.
   * Responsabilidades:
   * 1. Encerrar o servidor da API de forma graciosa (graceful shutdown).
   * 2. Desconectar do banco de dados MongoDB.
   * 3. Limpar quaisquer outros recursos que foram alocados.
   */
  async teardown() {
    console.log('\n--- 🧹 [ENV] Desconectando do banco de dados ---');
    // Verifica se o módulo do servidor foi salvo e se ele exporta uma função `stopServer`.
    // Se sim, chama a função para encerrar o servidor HTTP.
    if (this.global._serverModule && typeof this.global._serverModule.stopServer === 'function') {
      try {
        await this.global._serverModule.stopServer();
      } catch (e) {
        console.warn('Aviso: falha ao encerrar servidor de teste em-processo.', e.message);
      }
    }

    // Verifica se a conexão com o Mongoose existe e a encerra.
    // Isso libera os recursos e permite que o processo do Jest termine corretamente.
    if (this.global.mongooseConnection) {
      await this.global.mongooseConnection.disconnect();
    }
    // Chama o teardown da classe pai para finalizar o ambiente.
    await super.teardown();
    console.log('--- ✅ [ENV] Ambiente de teste finalizado ---');
  }
}

export default MongoTestEnvironment;