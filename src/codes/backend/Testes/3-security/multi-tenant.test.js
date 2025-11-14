// =================================================================================
// ARQUIVO: Testes/3-security/multi-tenant.test.js
//
// DESCRIÇÃO:
//            Este é um dos testes mais críticos do sistema. Ele valida a
//            arquitetura multi-tenant, garantindo que os dados de uma empresa
//            sejam completamente isolados dos dados de outra.
//
// O QUE ELE VALIDA:
//            1. Criação de Dados Isolados: Confirma que é possível criar transações
//               para múltiplas empresas de forma independente.
//            2. Bloqueio de Acesso Direto: Prova que um usuário não consegue
//               acessar um recurso específico de outra empresa, recebendo um erro 404.
//            3. Filtragem em Listagens: Garante que, ao listar recursos, um usuário
//               veja *apenas* os seus, e não os de outras empresas.
// =================================================================================
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const SETUP_FILE = path.join('Testes', 'test-setup.json');
const NUMBER_OF_COMPANIES = 3; // Reduzido para 3 para logs mais curtos
const PAYMENT_METHODS = ['credit_card', 'debit_card', 'pix', 'cash', 'other'];

describe('3. Teste de Isolamento de Dados (Multi-Tenant)', () => {
    let companies = [];
    let API_URL;

    // Etapa 1: Cadastra e loga em múltiplas empresas para simular um ambiente real.
    beforeAll(async () => {
        // Garante que a leitura do arquivo de setup seja assíncrona
        const fileContent = await fs.promises.readFile(SETUP_FILE, 'utf8');
        API_URL = JSON.parse(fileContent).apiUrl;

        console.log(`\n--- Configurando ${NUMBER_OF_COMPANIES} empresas para o teste multi-tenant ---`); // Reduzido para 3

        for (let i = 1; i <= NUMBER_OF_COMPANIES; i++) {
            const uniqueId = Date.now() + i;
            const companyData = {
                name: `Usuário Empresa ${i}`,
                email: `empresa_${uniqueId}@test.com`,
                password: 'password123',
                companyName: `Empresa Teste ${uniqueId}`,
                cnpj: String(uniqueId).slice(-14).padStart(14, '0') // CNPJ único baseado no timestamp
            };

            // Cadastrar
            await axios.post(`${API_URL}/auth/register`, companyData);

            // Logar para obter o token
            const loginResponse = await axios.post(`${API_URL}/auth/login`, {
                email: companyData.email,
                password: companyData.password,
            });

            companies.push({
                userId: loginResponse.data.data.user.id,
                token: loginResponse.data.data.token,
                companyName: companyData.companyName, // Adicionado para logs mais claros
                id: loginResponse.data.data.user.companyId,
                transactions: []
            });

            console.log(`✅ Empresa ${i} (${companyData.companyName}) cadastrada e logada.`);
        }
        console.log('--- Configuração multi-tenant concluída ---');
    }, 30000); // Aumenta o timeout do beforeAll para permitir o cadastro de várias empresas

    // Etapa 2: Cria uma transação para cada empresa, para termos dados para testar.
    test('deve criar uma transação para cada empresa', async () => {
        console.log('\n--- Criando transações individuais para cada empresa ---');

        for (let i = 0; i < companies.length; i++) {
            const company = companies[i];
            const transactionData = {
                description: `Transação da Empresa ${i + 1}`,
                amount: 100 * (i + 1),
                type: 'revenue',
                status: 'completed', // Campo obrigatório adicionado
                paymentMethod: PAYMENT_METHODS[i % PAYMENT_METHODS.length] // Cicla entre os métodos de pagamento
            };

            const response = await axios.post(`${API_URL}/transactions`, transactionData, {
                headers: { Authorization: `Bearer ${company.token}` }
            });

            expect(response.status).toBe(201);
            expect(response.data.data.description).toBe(transactionData.description);

            // Guarda a transação criada para usar nos testes seguintes
            companies[i].transactions.push(response.data.data);
            console.log(`Transação criada para ${company.companyName}. ID: ${response.data.data._id}`);
        }
    }, 20000);

    // Etapa 3: O teste principal. Valida que uma empresa não pode acessar dados de outra.
    test('deve impedir que uma empresa acesse a transação de outra', async () => {
        console.log('\n--- Validando isolamento de dados entre todas as empresas ---');

        // Para cada empresa dona de uma transação...
        for (let i = 0; i < companies.length; i++) {
            const ownerCompany = companies[i]; // A dona da transação
            const transactionId = ownerCompany.transactions[0]._id;

            console.log(`\nVerificando a transação ${transactionId} da ${ownerCompany.companyName}`);

            // ...vamos tentar acessar sua transação com o token de TODAS as outras empresas
            for (let j = 0; j < companies.length; j++) {
                // Pula se for a mesma empresa
                if (i === j) continue;

                const attackerCompany = companies[j]; // A empresa "invasora"

                try {
                    await axios.get(`${API_URL}/transactions/${transactionId}`, {
                        headers: { Authorization: `Bearer ${attackerCompany.token}` }
                    });
                    // Se a requisição funcionar, o teste deve falhar
                    fail(`${attackerCompany.companyName} conseguiu acessar dados de ${ownerCompany.companyName}`);
                } catch (error) {
                    // O esperado é um erro 404, pois a transação "não existe" para a outra empresa
                    expect(error.response.status).toBe(404);
                    console.log(`- OK: ${attackerCompany.companyName} foi bloqueada (Status 404).`);
                }
            }
        }
    }, 30000);

    test('deve garantir que cada empresa liste apenas suas próprias transações', async () => {
        console.log('\n--- Validando listagem de transações ---');

        for (const company of companies) {
            const response = await axios.get(`${API_URL}/transactions`, {
                headers: { Authorization: `Bearer ${company.token}` }
            });

            expect(response.status).toBe(200);
            // A lista deve conter exatamente 1 transação
            expect(response.data.data).toHaveLength(1);
            // O ID da transação na lista deve ser o mesmo que criamos para essa empresa
            expect(response.data.data[0]._id).toBe(company.transactions[0]._id);
            console.log(`- OK: ${company.companyName} listou apenas sua própria transação.`);
        }
    }, 20000);

    // Etapa 4: Limpa todos os usuários e empresas criados durante este teste.
    afterAll(async () => {
        console.log('\n--- Limpando dados de teste (Teardown) ---');
        for (const company of companies) {
            try {
                // MOTIVO DA MUDANÇA: O endpoint de exclusão de usuário foi corrigido.
                await axios.delete(`${API_URL}/auth/users/${company.userId}`, {
                    headers: { Authorization: `Bearer ${company.token}` }
                });
                console.log(`- ✅ Empresa ${company.companyName} e dados associados excluídos com sucesso.`);
            } catch (error) {
                console.error(`- ❌ Falha ao excluir a empresa ${company.companyName}:`, error.response?.data || error.message);
            }
        }
    });
});