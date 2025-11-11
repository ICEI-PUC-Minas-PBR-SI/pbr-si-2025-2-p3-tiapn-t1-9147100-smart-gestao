import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import SessionToken from '../models/SessionToken.js';
import bcrypt from 'bcryptjs';
import Company from '../models/Company.js';
import Permission from '../models/Permission.js'; // Corrigido: Importa o modelo correto.
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente (como JWT_SECRET) do arquivo .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Helper para obter o diretório atual com ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setup = async () => {
  console.log('\n--- 🚀 [SETUP] Conectando e populando o banco de dados de TESTE online ---');
  if (mongoose.connection.readyState === 0) {
    // Conecta-se ao banco de dados de TESTE definido em .env (MONGO_URI_TEST)
    if (!process.env.MONGO_URI_TEST) throw new Error('ERRO FATAL: A variável MONGO_URI_TEST não está definida no seu arquivo .env');
    await mongoose.connect(process.env.MONGO_URI_TEST);
  }

  // 3. Limpar coleções existentes
  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    SessionToken.deleteMany({}),
    Permission.deleteMany({}) // Garante que a coleção de permissões esteja limpa.
  ]);

  // Gera um hash de senha para os usuários de teste
  const passwordHash = await bcrypt.hash('password123', 10);

  // Cria uma permissão de teste para associar aos usuários.
  // Isso resolve o erro 'Cannot find module Role.js' e satisfaz a dependência do modelo User.
  const testPermission = await Permission.create({
    name: 'USER_TEST',
    description: 'Permissão padrão para usuários de teste',
    level: 1,
  });

  // 4. Criar dados de teste (empresas e usuários)
  const companyA = await Company.create({ name: 'Empresa A de Teste', cnpj: '00000000000001' });
  const userA = await User.create({
    name: 'Usuário A',
    email: 'usera@test.com',
    passwordHash: passwordHash,
    companyId: companyA._id,
    role: testPermission._id, // Associa a permissão de teste criada.
  });

  const companyB = await Company.create({ name: 'Empresa B de Teste', cnpj: '00000000000002' });
  const userB = await User.create({
    name: 'Usuário B',
    email: 'userb@test.com',
    passwordHash: passwordHash,
    companyId: companyB._id,
    role: testPermission._id, // Associa a mesma permissão de teste.
  });
  console.log('✅ Empresa Padrão 1 criada para os testes.');
  console.log('✅ Empresa Padrão 2 criada para os testes.');

  // Função auxiliar para gerar um token JWT simples para os testes
  const generateToken = (userId, companyId) => {
    return jwt.sign({ userId, companyId }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
  };

  // 5. Salvar dados para uso nos testes
  const setupData = {
    // Aponta para o servidor principal que estará rodando na porta 5000.
    apiUrl: 'http://localhost:5000/api',
    companyA: {
      _id: companyA._id.toString(),
      name: companyA.name,
      userId: userA._id.toString(),
      email: userA.email,
      password: 'password123',
      token: generateToken(userA._id, companyA._id),
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

  fs.writeFileSync(path.join(__dirname, 'test-setup.json'), JSON.stringify(setupData, null, 2));
  console.log(`--- ✅ [SETUP] Dados de teste salvos em test-setup.json ---`);

  // A conexão com o banco de teste permanecerá aberta para os testes e será fechada pelo `test-teardown.js`.
};

export default setup;