/**
 * =================================================================================
 * ARQUIVO: Scripts/create-test-companies.js
 *
 * DESCRIÇÃO:
 *            Este script é uma ferramenta de desenvolvimento para criar um conjunto
 *            de empresas e usuários de teste fixos e persistentes.
 *            É ideal para ser usado em demonstrações e para o desenvolvimento do frontend,
 *            pois garante que sempre haverá dados consistentes para login.
 *
 * COMO USAR:
 *            Execute `npm run create-test-users` na pasta `src/codes/backend`.
 * =================================================================================
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import Company from '../models/Company.js';
import User from '../models/User.js';
import Permission from '../models/Permission.js';
import { USER_COMPANY } from '../utils/constants.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const companiesToCreate = [
  {
    companyName: 'Empresa Frontend',
    cnpj: '11111111000111',
    userName: 'Usuário Frontend',
    email: 'empresa-frontend@test.com',
    password: 'password123',
  },
  {
    companyName: 'Empresa Backend',
    cnpj: '22222222000122',
    userName: 'Usuário Backend',
    email: 'empresa-backend@test.com',
    password: 'password123',
  },
  {
    companyName: 'Empresa React',
    cnpj: '33333333000133',
    userName: 'Usuário React',
    email: 'empresa-react@test.com',
    password: 'password123',
  },
];

const createTestCompanies = async () => {
  console.log('\n--- 🚀 Iniciando criação de empresas de teste fixas ---');
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const userPermission = await Permission.findOne({ name: USER_COMPANY });
    if (!userPermission) {
      throw new Error("Permissão de usuário padrão não encontrada. Execute `initPermissions` primeiro.");
    }

    const passwordHash = await bcrypt.hash('password123', 10);
    const createdData = [];

    for (const companyData of companiesToCreate) {
      const existingCompany = await Company.findOne({ cnpj: companyData.cnpj });

      if (existingCompany) {
        console.log(`⚠️  Aviso: Empresa com CNPJ "${companyData.cnpj}" já existe. Pulando criação.`);
        const user = await User.findOne({ email: companyData.email });
        createdData.push({ ...companyData, userId: user?._id });
        continue;
      }

      const newCompany = await Company.create({
        name: companyData.companyName,
        cnpj: companyData.cnpj,
        email: companyData.email,
      });

      const newUser = await User.create({
        name: companyData.userName,
        email: companyData.email,
        passwordHash,
        companyId: newCompany._id,
        role: userPermission._id,
      });

      createdData.push({ ...companyData, userId: newUser._id });
      console.log(`✅ Empresa "${companyData.companyName}" e usuário associado criados com sucesso.`);
    }

    // Salva as credenciais em um arquivo de documentação para fácil referência
    const docPath = path.resolve(process.cwd(), 'Testes', 'Docs', 'dados-empresas-teste.md');
    let docContent = '# Credenciais das Empresas de Teste Manuais\n\n';
    docContent += '| Empresa | Email | Senha |\n';
    docContent += '|---|---|---|\n';
    createdData.forEach(data => {
      docContent += `| ${data.companyName} | \`${data.email}\` | \`${data.password}\` |\n`;
    });

    fs.writeFileSync(docPath, docContent);
    console.log(`\n--- ✅ Processo concluído! Dados salvos em: ${docPath} ---`);

  } catch (error) {
    console.error('\n❌ Erro ao criar empresas de teste:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createTestCompanies();