/**
 * =================================================================================
 * ARQUIVO: Scripts/create-test-companies.js
 * DESCRIÇÃO: Script utilitário para criar ou atualizar um conjunto fixo de empresas
 *            de teste, facilitando validações manuais e a exploração da API.
 *            Ele é idempotente: se uma empresa já existe, ele apenas tenta logar
 *            para obter um token atualizado.
 * USO: `npm run create-test-users`
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
 * Tenta criar uma empresa de teste. Se já existir, tenta fazer o login.
 * Retorna os dados essenciais (IDs, tokens) para a empresa.
 * @param {string} name - O nome da empresa (ex: "Empresa Frontend").
 * @param {string} emailSuffix - O sufixo para o email (ex: "frontend").
 * @returns {Promise<object|null>} Um objeto com os dados da empresa ou `null` em caso de erro.
 */
async function createOrLogin(name, emailSuffix) {
    const companyData = {
        name: `Usuário ${name}`,
        email: `empresa-${emailSuffix}@test.com`,
        password: 'password123', // Senha padrão para facilitar os testes
        companyName: name,
        // Gera um CNPJ único para evitar conflitos
        cnpj: String(Date.now() + Math.floor(Math.random() * 1000)).slice(-14).padStart(14, '0')
    };

    try {
        // Fluxo 1: Tenta registrar a nova empresa e usuário.
        await axios.post(`${API_URL}/auth/register`, companyData);
        console.log(`✅ Empresa "${name}" registrada com sucesso.`);

        // Após o registro, realiza o login para obter os tokens e IDs.
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: companyData.email,
            password: companyData.password,
        });
        console.log(`✅ Login realizado para "${name}".`);

        // Retorna os dados combinados do registro e do login.
        return { // Acessa a estrutura de resposta padronizada
            ...companyData,
            token: loginResponse.data.data.token,
            refreshToken: loginResponse.data.data.refreshToken,
            companyId: loginResponse.data.data.user.companyId,
            userId: loginResponse.data.data.user.id,
        };
    } catch (error) {
        // Fluxo 2: Se o erro for 409 (Conflict), a empresa/usuário já existe.
        // Neste caso, o script tenta apenas fazer o login para obter um token atualizado.
        if (error.response && error.response.status === 409) {
            console.warn(`⚠️  Aviso: Empresa com e-mail "${companyData.email}" já existe. Tentando apenas logar...`);
            try {
                const loginResponse = await axios.post(`${API_URL}/auth/login`, { email: companyData.email, password: companyData.password });
                console.log(`✅ Login realizado para empresa existente "${name}".`);
                return { // Acessa a estrutura de resposta padronizada
                    ...companyData,
                    token: loginResponse.data.data.token,
                    refreshToken: loginResponse.data.data.refreshToken,
                    companyId: loginResponse.data.data.user.companyId,
                    userId: loginResponse.data.data.user.id,
                };
            } catch (loginError) {
                // Se o login falhar (ex: senha mudou), informa o erro e continua.
                console.error(`❌ Falha ao tentar logar na empresa existente "${name}". Verifique se a senha está correta.`, loginError.response?.data || loginError.message);
                return null;
            }
        }
        // Tratamento de outros erros (ex: servidor offline).
        if (error.response) {
            console.error(`❌ Erro na API ao processar "${name}": Status ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            console.error(`❌ Erro de conexão ao tentar contatar a API para "${name}". Verifique se o servidor está rodando em ${API_URL}.`);
        } else {
            console.error(`❌ Erro inesperado ao criar/logar na empresa "${name}":`, error.message);
        }
        return null;
    }
}

/**
 * Função principal que orquestra a criação das empresas e a geração do arquivo de documentação.
 */
async function main() {
    console.log('\n--- 🚀 Iniciando criação de empresas de teste fixas ---');

    const companiesToCreate = [
        { name: 'Empresa Frontend', suffix: 'frontend' },
        { name: 'Empresa Backend', suffix: 'backend' },
        { name: 'Empresa React', suffix: 'react' },
    ];

    // Cabeçalho do arquivo de documentação.
    let markdownContent = `#  Credenciais das Empresas de Teste\n\n` +
        `Este arquivo contém os dados das empresas de teste fixas, criadas para facilitar a validação manual do frontend e a exploração da API.\n\n` +
        `> **Importante:** Este arquivo é **gerado e atualizado automaticamente** pelo script \`Scripts/create-test-companies.js\`. Não o edite manualmente. Se precisar recriar ou garantir que os dados estejam atualizados, execute o seguinte comando na pasta \`src/codes/backend\`:\n` +
        `> \`\`\`bash\n> npm run create-test-users\n> \`\`\`\n\n` +
        `> **Nota:** Os Access Tokens (JWT) têm uma vida útil curta. Se os testes manuais falharem com erro \`401 Unauthorized\`, execute o comando acima novamente para gerar tokens novos e atualizados.\n\n` +
        `---\n\n`;

    for (const company of companiesToCreate) {
        const data = await createOrLogin(company.name, company.suffix);
        if (data) {
            markdownContent += `## ${data.companyName}\n\n- **E-mail:** \`${data.email}\`\n- **Senha:** \`${data.password}\`\n- **ID da Empresa:** \`${data.companyId}\`\n- **ID do Usuário:** \`${data.userId}\`\n- **Access Token:** \`Bearer ${data.token}\`\n\n---\n\n`;
        }
    }

    // Garante que a pasta de documentação dos testes exista antes de escrever o arquivo.
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, markdownContent);
    console.log(`\n--- ✅ Processo concluído! Dados salvos em: ${OUTPUT_FILE} ---\n`);
}

main().catch(err => console.error("Ocorreu um erro inesperado no script:", err));