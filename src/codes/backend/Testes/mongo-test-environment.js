/**
 * =================================================================================
 * ARQUIVO: Testes/mongo-test-environment.js
 *
 * MOTIVO DA CRIAÇÃO:
 * Este arquivo foi criado para resolver problemas de "condição de corrida" e
 * compartilhamento de estado entre os scripts `globalSetup` e `globalTeardown` do Jest.
 * DESCRIÇÃO: Um ambiente de teste personalizado para o Jest.
 *            Esta classe gerencia o ciclo de vida de um servidor MongoDB em memória.
 *            Ela inicia o servidor ANTES de todos os testes e o desliga APÓS
 *            todos os testes, garantindo um ambiente de banco de dados limpo e
 *            isolado para cada execução da suíte de testes.
 * =================================================================================
 */
import { MongoMemoryServer } from 'mongodb-memory-server';
import NodeEnvironment from 'jest-environment-node';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

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
    console.log('   - [PROCESSO] Carregando o servidor de banco de dados em memória...');
    // Inicia o servidor e armazena a instância no objeto global do Node.js
    // para que o teardown possa acessá-la.
    this.global.__MONGOD__ = await MongoMemoryServer.create();
    const mongoUri = this.global.__MONGOD__.getUri();

    console.log('   - [OK] Banco de dados em memória iniciado.');

    // Expõe a URI para o globalSetup e para os próprios testes.
    this.global.process.env.MONGO_URI_TEST = mongoUri;

    // Salva a URI em um arquivo para que o `test-server.js` (que roda em um processo separado)
    // possa se conectar ao mesmo banco de dados em memória.
    fs.writeFileSync(path.join(process.cwd(), '.mongo-uri-test'), mongoUri);
  }

  /**
   * Executado após todos os testes. Desconecta o Mongoose e para o servidor.
   */
  async teardown() {
    console.log('\n--- 🧹 [ENV] Desconectando e parando o MongoDB ---');
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    // Remove o arquivo temporário de URI para limpar o ambiente.
    const uriPath = path.join(process.cwd(), '.mongo-uri-test');
    if (fs.existsSync(uriPath)) {
      fs.unlinkSync(uriPath);
    }
    await this.global.__MONGOD__.stop();
    await super.teardown();
    console.log('--- ✅ [ENV] Ambiente de teste finalizado ---');
  }
}

export default MongoTestEnvironment;