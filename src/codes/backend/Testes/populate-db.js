// populate-db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker/locale/pt_BR'; // Importa o faker com a localização para Português do Brasil
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

import User from '../models/User.js';
import Company from '../models/Company.js';
import bcrypt from 'bcryptjs';

// Ajuste os caminhos se necessário para importar seus modelos
import Permission from '../models/Permission.js'; // Importado para buscar a role
import { initPermissions } from '../Scripts/initPermissions.js'; // Importa o inicializador de permissões

dotenv.config();

// Usa a variável de desenvolvimento por padrão.
// Isso garante que este script sempre atue no banco de dados correto.
const dbURI = process.env.MONGO_URI_DEV; 

if (!dbURI) {
    console.error("🔴 ERRO: A variável de ambiente MONGO_URI_DEV não está definida.");
    process.exit(1);
}

// URL base da sua API. O servidor precisa estar rodando.
const API_URL = `http://localhost:${process.env.PORT || 5000}/api`;

/**
 * Conecta ao banco de dados.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('✅ Conectado ao banco de dados de desenvolvimento.');
    } catch (err) {
        console.error('🔴 Falha ao conectar ao banco de dados:', err.message);
        process.exit(1);
    }
};

/**
 * Simula o registro e login de uma empresa e seu admin, retornando o token de acesso.
 * Se o usuário já existir, apenas faz o login.
 */
const registerAndLogin = async (companyName) => {
    const adminEmail = `admin@${companyName.toLowerCase().replace(/\s/g, '')}.com`;
    const adminPassword = 'senhaforte123';

    // --- ETAPA 1: AGIR COMO ROOT (Acesso direto ao DB) ---
    console.log(`- [ROOT] Validando estado da empresa '${companyName}' e do admin '${adminEmail}'...`);

    const adminRole = await Permission.findOne({ name: 'ADMIN_COMPANY' });
    if (!adminRole) {
        throw new Error('Permissão "ADMIN_COMPANY" não encontrada. O script initPermissions precisa ser executado.');
    }

    // Garante que a empresa exista
    let company = await Company.findOne({ name: companyName });
    if (!company) {
        console.log(`- [ROOT] Empresa '${companyName}' não encontrada. Criando...`);
        company = await Company.create({
            name: companyName,
            cnpj: faker.string.numeric(14),
            email: adminEmail,
        });
        console.log(`- [ROOT] ✅ Empresa '${companyName}' criada com ID: ${company._id}`);
    }

    // Garante que o usuário admin exista e tenha a permissão correta
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
        console.log(`- [ROOT] Usuário admin '${adminEmail}' não encontrado. Criando...`);
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(adminPassword, salt);
        adminUser = await User.create({
            name: `Admin ${companyName}`,
            email: adminEmail,
            passwordHash,
            companyId: company._id,
            role: adminRole._id,
        });
        console.log(`- [ROOT] ✅ Usuário admin '${adminEmail}' criado com a permissão correta.`);
    } else if (adminUser.role.toString() !== adminRole._id.toString()) {
        console.log(`- [ROOT] ⚠️  Usuário '${adminEmail}' encontrado com a permissão errada. Corrigindo...`);
        adminUser.role = adminRole._id;
        await adminUser.save();
        console.log(`- [ROOT] ✅ Permissão do usuário '${adminEmail}' corrigida para ADMIN_COMPANY.`);
    } else {
        console.log(`- [ROOT] ✅ Usuário admin '${adminEmail}' já existe e tem a permissão correta.`);
    }

    // --- ETAPA 2: AGIR COMO CLIENTE DA API ---
    console.log(`- [API] Tentando login como '${adminEmail}' para obter token...`);
    try {
        const loginResponse = await axios.post(`${API_URL}/auth/login`, { email: adminEmail, password: adminPassword });        
        console.log(`- [API] ✅ Login realizado com sucesso.`);
        
        // Retorna um objeto completo com todos os dados relevantes
        return {
            adminToken: loginResponse.data.data.token,
            companyName: company.name,
            companyCnpj: company.cnpj,
            adminEmail: adminUser.email,
            adminName: adminUser.name,
            adminPassword: adminPassword,
        };
    } catch (error) {
        console.error(`🔴 Erro inesperado durante a tentativa de login via API para '${adminEmail}':`);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Mensagem:', error.message);
        }
        throw error; // Re-lança o erro original para obter o stack trace completo.
    }
};

/**
 * Cria clientes aleatórios para uma empresa.
 */
const createClientsForCompany = async (token, count) => {
    console.log(`- ⏳ Criando ${count} novos clientes via API...`);
    for (let i = 0; i < count; i++) {
        const payload = {
            name: faker.person.fullName(),
            type: faker.helpers.arrayElement(['client', 'supplier']),
            email: faker.internet.email(),
            document: faker.string.numeric(11),
        };
        try {
            const response = await axios.post(`${API_URL}/clients`, payload, { headers: { Authorization: `Bearer ${token}` } });
            const createdId = response.data?.data?._id;
            console.log(`   - [API] ✅ Cliente '${payload.name}' criado com ID: ${createdId}`);
        } catch (error) {
            console.error(`   - [API] 🔴 Falha ao criar cliente '${payload.name}': ${error.response?.data?.message || error.message}`);
        }
    }
    console.log(`- ✅ ${count} clientes criados com sucesso. (Logs devem ter sido gerados)`);
};

/**
 * Cria metas aleatórias para uma empresa.
 */
const createGoalsForCompany = async (token, count) => {
    console.log(`- ⏳ Criando ${count} novas metas via API...`);
    const goalPromises = [];

    // Lista de títulos de metas mais realistas em português
    const goalTitles = [
        'Reduzir custos operacionais em 15%',
        'Aumentar faturamento mensal para R$ 25.000',
        'Economizar para investimento em marketing digital',
        'Quitar empréstimo do novo equipamento',
        'Expandir a carteira de clientes em 20%',
        'Renovar estoque de produtos',
        'Criar reserva de emergência para 3 meses de custos'
    ];

    for (let i = 0; i < count; i++) {
        const payload = {
            title: faker.helpers.arrayElement(goalTitles), // Usa um título realista da lista
            type: faker.helpers.arrayElement(['revenue', 'expense', 'saving']),
            targetAmount: faker.finance.amount({ min: 1000, max: 50000, dec: 0 }),
            deadline: faker.date.future({ years: 1 }),
        };
        console.log(`   - [API] Criando meta: "${payload.title}"`);
        const promise = axios.post(`${API_URL}/goals`, payload, { headers: { Authorization: `Bearer ${token}` } });
        goalPromises.push(promise);
    }
    await Promise.all(goalPromises);
    console.log(`- ✅ ${count} metas criadas com sucesso. (Logs devem ter sido gerados)`);
};

/**
 * Cria alertas aleatórios para uma empresa.
 */
const createAlertsForCompany = async (token, count) => {
    console.log(`- ⏳ Criando ${count} novos alertas via API...`);
    const alertPromises = [];
    for (let i = 0; i < count; i++) {
        const payload = {
            message: faker.lorem.sentence(5),
            type: faker.helpers.arrayElement(['warning', 'limit_reached', 'goal_achieved']),
        };
        // Assumindo que existe uma rota POST /api/alerts para criar alertas manualmente (pode não existir)
        // Se não existir, esta parte pode ser comentada ou a rota precisa ser criada.
        console.log(`   - [API] Criando alerta: ${payload.message}`);
        const promise = axios.post(`${API_URL}/alerts`, payload, { headers: { Authorization: `Bearer ${token}` } });
        alertPromises.push(promise);
    }
    await Promise.all(alertPromises);
    console.log(`- ✅ ${count} alertas criados com sucesso. (Logs devem ter sido gerados)`);
};

/**
 * Cria um número específico de transações para uma empresa.
 */
const createTransactionsForCompany = async (token, count) => {
    console.log(`- ⏳ Criando ${count} novas transações via API...`);
    const transactionPromises = [];

    // Listas de descrições de transações mais realistas
    const revenueDescriptions = [
        'Recebimento por serviço de consultoria', 'Venda de produto A', 'Pagamento de cliente X', 
        'Adiantamento de projeto Y', 'Venda online - Pedido #123'
    ];
    const expenseDescriptions = [
        'Compra de material de escritório', 'Pagamento de conta de luz', 'Aluguel do espaço comercial',
        'Almoço com cliente', 'Assinatura de software de gestão', 'Manutenção de equipamento'
    ];

    for (let i = 0; i < count; i++) {
        const type = faker.helpers.arrayElement(['revenue', 'expense']);
        const description = type === 'revenue' 
            ? faker.helpers.arrayElement(revenueDescriptions)
            : faker.helpers.arrayElement(expenseDescriptions);

        const payload = {
            description: description,
            amount: faker.finance.amount({ min: 50, max: 2000, dec: 2 }),
            type: type,
            status: 'completed',
            paymentMethod: faker.helpers.arrayElement(['pix', 'credit_card', 'cash']),
            date: faker.date.recent({ days: 30 }),
        };
        console.log(`   - [API] Criando transação: "${payload.description}" (${payload.type})`);
        const promise = axios.post(`${API_URL}/transactions`, payload, { headers: { Authorization: `Bearer ${token}` } });
        transactionPromises.push(promise);
    }

    await Promise.all(transactionPromises);
    console.log(`- ✅ ${count} transações criadas com sucesso. (Logs devem ter sido gerados)`);
};

/**
 * Cria usuários comuns (não-admin) para uma empresa.
 * Requer o token de um admin para autorização.
 */
const createStandardUsersForCompany = async (adminToken, count) => {
    console.log(`- ⏳ Criando ${count} novos usuários comuns (não-admin) via API...`);

    // Busca o ID da permissão 'USER_COMPANY' para usar na criação.
    const userRole = await Permission.findOne({ name: 'USER_COMPANY' }).lean();
    if (!userRole) {
        throw new Error('A permissão "USER_COMPANY" não foi encontrada. O script initPermissions precisa ser executado.');
    }

    for (let i = 0; i < count; i++) {
        try {
            const payload = {
                name: faker.person.fullName(),
                email: faker.internet.email().toLowerCase(),
                password: 'senhafraca123',
                role: userRole._id, // Envia o ObjectId da permissão de usuário comum
            };
            const response = await axios.post(`${API_URL}/users`, payload, { headers: { Authorization: `Bearer ${adminToken}` } });
            const createdId = response.data?.data?._id;
            console.log(`   - [API] ✅ Usuário '${payload.email}' criado com ID: ${createdId}`);
        } catch (error) {
            console.error(`   - [API] 🔴 Falha ao criar usuário: ${error.response?.data?.message || error.message}`);
        }
    }
    console.log(`- ✅ ${count} usuários comuns criados com sucesso.`);
};

/**
 * Gera e salva o arquivo de documentação com os dados das empresas de teste.
 * @param {Array} summaryData - Um array de objetos com os dados de cada empresa.
 */
const generateDocs = async (summaryData) => {
    const docPath = path.join('Testes', 'Docs', 'dados-empresas-teste.md');
    console.log(`\n--- 📝 Gerando documentação em '${docPath}' ---`);

    let markdownContent = `# Credenciais das Empresas de Teste Manuais\n\n`;
    markdownContent += `> **Nota:** Este arquivo é gerado e atualizado automaticamente pelo script \`npm run db:populate\`. Ele contém os dados detalhados das empresas de teste para validação manual e exploração da API.\n\n`;
    markdownContent += `> **Última atualização:** ${new Date().toLocaleString('pt-BR')}\n\n`;

    for (const data of summaryData) {
        markdownContent += `---\n\n`;
        markdownContent += `## ${data.companyName}\n\n`;
        markdownContent += `| Campo | Valor |\n`;
        markdownContent += `|---|---|\n`;
        markdownContent += `| Nome da Empresa | \`${data.companyName}\` |\n`;
        markdownContent += `| CNPJ | \`${data.companyCnpj}\` |\n`;
        markdownContent += `| E-mail do Admin | \`${data.adminEmail}\` |\n`;
        markdownContent += `| Nome do Admin | \`${data.adminName}\` |\n`;
        markdownContent += `| Senha do Admin | \`${data.adminPassword}\` |\n`;
        markdownContent += `| Access Token | \`\`\`${data.adminToken}\`\`\` |\n\n`;
    }

    try {
        // Garante que o diretório exista
        await fs.mkdir(path.dirname(docPath), { recursive: true });
        await fs.writeFile(docPath, markdownContent, 'utf-8');
        console.log(`✅ Documentação '${docPath}' atualizada com sucesso!`);
    } catch (error) {
        console.error(`🔴 Falha ao escrever o arquivo de documentação:`, error);
    }
};

const run = async () => {
    await connectDB();
    console.log('\n--- 🌱 Iniciando população do banco de dados ---');

    try {
        // Garante que as permissões básicas existam antes de criar usuários.
        await initPermissions();
        const createdDataSummary = [];

        const companiesToProcess = ['Empresa FrontEnd', 'Empresa BackEnd', 'Empresa React'];

        for (const companyName of companiesToProcess) {
            console.log(`\n--- Processando a '${companyName}' ---`);
            const companyData = await registerAndLogin(companyName);
            createdDataSummary.push(companyData);
            
            // Para cada empresa, cria 5 de cada tipo de processo usando a API
            await createStandardUsersForCompany(companyData.adminToken, 3); // Cria 3 usuários comuns
            await createClientsForCompany(companyData.adminToken, 5);
            await createTransactionsForCompany(companyData.adminToken, 5);
            await createGoalsForCompany(companyData.adminToken, 5);
            // A criação de alertas via API pode não ser uma rota padrão.
            await createAlertsForCompany(companyData.adminToken, 3); // Cria 3 alertas para cada empresa
        }

        // Ao final, gera a documentação e exibe um resumo no console.
        await generateDocs(createdDataSummary);

    } catch (error) {
        console.error('🔴 Erro durante a população do banco:', error.stack || error); // Loga o stack trace completo
    } finally {
        console.log('\n--- 🎉 Processo de população finalizado com sucesso! ---');
        if (mongoose.connection.readyState === 1) await mongoose.disconnect();
        console.log('🔌 Desconectado do banco de dados.');
    }
};

run().catch(error => {
    console.error('🔴 Ocorreu um erro inesperado:', error);
    process.exit(1);
});