/**
 * =================================================================================
 * ARQUIVO: Testes/test-setup.js
 * DESCRIÇÃO: Script de configuração global para a suíte de testes do Jest.
 *            Este script é executado uma única vez ANTES de todos os testes.
 *            Sua função é criar um ambiente de teste consistente, cadastrando
 *            usuários/empresas padrão e salvando seus dados (IDs, tokens) em um
 *            arquivo temporário para que os testes possam reutilizá-los.
 * =================================================================================
 */
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000/api';
const SETUP_FILE = path.join('Testes', 'test-setup.json');

/**
 * Cria uma empresa de teste, realiza o login e retorna seus dados essenciais.
 * @param {number} index - Um número para garantir a unicidade dos dados (email, CNPJ).
 * @returns {Promise<object>} Um objeto contendo os dados da empresa criada,
 *                            incluindo seu token de acesso, ID do usuário e ID da empresa.
 */
async function createTestCompany(index) {
    const uniqueId = Date.now() + index;
    const companyData = {
        name: `Usuário Padrão ${index}`,
        email: `empresa_padrao_${uniqueId}@test.com`,
        password: 'password123',
        companyName: `Empresa Padrão ${uniqueId}`,
        cnpj: String(uniqueId).slice(-14).padStart(14, '0')
    };

    // Cadastra e faz login
    await axios.post(`${API_URL}/auth/register`, companyData);
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: companyData.email,
        password: companyData.password,
    });

    console.log(`✅ Empresa Padrão ${index} criada para os testes.`);

    return {
        ...companyData,
        token: loginResponse.data.token,
        companyId: loginResponse.data.user.companyId,
        userId: loginResponse.data.user.id,
    };
}

/**
 * Função principal de setup, exportada para ser usada pelo Jest.
 * Cria duas empresas de teste (A e B) e salva seus dados no arquivo `test-setup.json`.
 */
export default async () => {
    console.log('\n--- 🚀 Iniciando Setup Global de Testes ---');

    // Cria 2 empresas que serão usadas em todos os testes
    const companyA = await createTestCompany(1);
    const companyB = await createTestCompany(2);

    const testData = { companyA, companyB };

    // Salva os dados em um arquivo para que os testes possam acessá-los
    fs.writeFileSync(SETUP_FILE, JSON.stringify(testData, null, 2));
    console.log(`--- ✅ Setup Global Concluído. Dados salvos em ${SETUP_FILE} ---\n`);
};