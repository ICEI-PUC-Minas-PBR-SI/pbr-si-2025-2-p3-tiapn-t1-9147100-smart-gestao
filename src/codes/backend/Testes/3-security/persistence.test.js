/**
 * =================================================================================
 * ARQUIVO: Testes/3-security/persistence.test.js
 *
 * DESCRIÇÃO:
 *            Este teste "meta" valida uma das premissas mais importantes do ambiente
 *            de testes: que a execução da suíte de testes automatizados (`npm test`)
 *            NÃO destrói os dados de teste manuais.
 *
 * FLUXO DO TESTE:
 * 1. Garante que as empresas de teste manuais existam (executando `create-test-users`).
 * 2. Executa a suíte de testes completa (`npm test`).
 * 3. Após a conclusão, conecta-se ao banco de dados e verifica se as empresas
 *    manuais ainda estão presentes.
 * =================================================================================
 */
import { exec } from 'child_process';
import mongoose from 'mongoose';
import User from '../../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Security: Persistência de Dados Manuais', () => {
    it('deve garantir que os usuários de teste manuais permaneçam no banco após a execução de `npm test`', async () => {
        const manualTestEmails = [
            'empresa-frontend@test.com',
            'empresa-backend@test.com',
            'empresa-react@test.com',
        ];

        // Função para executar um comando no shell
        const runCommand = (command) => new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) return reject(error);
                resolve(stdout);
            });
        });

        // 1. Garante que os usuários manuais existam.
        await runCommand('npm run create-test-users');

        // 2. Executa a suíte de testes completa.
        await runCommand('npm run test:no-clean');

        // 3. Conecta-se ao banco de dados NOVAMENTE, pois o processo de teste anterior fechou a conexão.
        await mongoose.connect(process.env.MONGO_URI);

        try {
            // 4. Verifica se os usuários manuais ainda existem no banco.
            const foundUsers = await User.find({ email: { $in: manualTestEmails } });
            expect(foundUsers.length).toBe(manualTestEmails.length);
        } finally {
            // 5. Garante que a conexão seja fechada, mesmo que o teste falhe.
            await mongoose.disconnect();
        }
    });
});