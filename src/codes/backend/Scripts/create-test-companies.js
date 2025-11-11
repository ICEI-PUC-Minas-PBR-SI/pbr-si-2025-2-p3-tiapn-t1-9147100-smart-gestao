/**
 * =================================================================================
 * ARQUIVO: Scripts/create-test-companies.js
 * DESCRIÇÃO: Script utilitário para criar um conjunto fixo de empresas de teste
 *            para uso em validações manuais e exploração do frontend.
 *            Este script é executado manualmente e gera um arquivo .md com
 *            as credenciais para fácil consulta.
 * USO: node Scripts/create-test-companies.js
 * =================================================================================
 */
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env na raiz do backend
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const API_URL = `http://localhost:${process.env.PORT || 5000}/api`;
const OUTPUT_FILE = path.join('Testes', 'Docs', 'dados-empresas-teste.md');

/**
 * Cria uma empresa de teste, realiza o login e retorna seus dados essenciais.
 * @param {string} name - O nome da empresa (ex: "Empresa Frontend").
 * @param {string} emailSuffix - O sufixo para o email (ex: "frontend").
 * @returns {Promise<object|null>} Um objeto com os dados da empresa ou null em caso de erro.
 */
async function createAndLogin(name, emailSuffix) {
    const companyData = {
        name: `Usuário ${name}`,
        email: `empresa-${emailSuffix}@test.com`,
        password: 'password123', // Senha padrão para facilitar os testes
        companyName: name,
        // Gera um CNPJ único para evitar conflitos
        cnpj: String(Date.now() + Math.floor(Math.random() * 1000)).slice(-14).padStart(14, '0')
    };

    try {
        // 1. Tenta registrar a nova empresa e usuário
        await axios.post(`${API_URL}/auth/register`, companyData);
        console.log(`✅ Empresa "${name}" registrada com sucesso.`);

        // 2. Realiza o login para obter os tokens e IDs
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: companyData.email,
            password: companyData.password,
        });
        console.log(`✅ Login realizado para "${name}".`);

        return {
            ...companyData,
            token: loginResponse.data.token,
            refreshToken: loginResponse.data.refreshToken,
            companyId: loginResponse.data.user.companyId,
            userId: loginResponse.data.user.id,
        };
    } catch (error) {
        // Se o erro for 409 (Conflict), significa que a empresa já existe.
        if (error.response && error.response.status === 409) {
            console.warn(`⚠️  Aviso: Empresa com e-mail "${companyData.email}" já existe. Pulando criação.`);
            // Mesmo que já exista, tentamos fazer login para obter os dados atualizados.
            const loginResponse = await axios.post(`${API_URL}/auth/login`, { email: companyData.email, password: companyData.password });
            return { ...companyData, ...loginResponse.data, token: loginResponse.data.token, companyId: loginResponse.data.user.companyId, userId: loginResponse.data.user.id };
        }
        console.error(`❌ Erro ao criar/logar na empresa "${name}":`, error.message);
        return null;
    }
}

/**
 * Função principal que orquestra a criação das empresas e a geração do arquivo.
 */
async function main() {
    console.log('\n--- 🚀 Iniciando criação de empresas de teste fixas ---');

    const companiesToCreate = [
        { name: 'Empresa Frontend', suffix: 'frontend' },
        { name: 'Empresa Backend', suffix: 'backend' },
        { name: 'Empresa React', suffix: 'react' },
    ];

    let markdownContent = `#  Credenciais das Empresas de Teste\n\nEste arquivo contém os dados das empresas de teste fixas para validação manual.\n\n`;

    for (const company of companiesToCreate) {
        const data = await createAndLogin(company.name, company.suffix);
        if (data) {
            markdownContent += `## ${data.companyName}\n\n- **E-mail:** \`${data.email}\`\n- **Senha:** \`${data.password}\`\n- **ID da Empresa:** \`${data.companyId}\`\n- **ID do Usuário:** \`${data.userId}\`\n- **Access Token:** \`Bearer ${data.token}\`\n\n---\n\n`;
        }
    }

    fs.writeFileSync(OUTPUT_FILE, markdownContent);
    console.log(`\n--- ✅ Processo concluído! Dados salvos em: ${OUTPUT_FILE} ---\n`);
}

main().catch(err => console.error("Ocorreu um erro inesperado no script:", err));