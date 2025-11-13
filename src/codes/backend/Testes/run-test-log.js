/**
 * =================================================================================
 * ARQUIVO: Testes/run-test-log.js
 * DESCRIÇÃO: Script executor para a suíte de testes automatizados.
 *            Ele orquestra a execução do Jest, captura toda a saída (incluindo
 *            cores) para exibição no console e, simultaneamente, salva uma
 *            versão limpa (sem códigos de cor) em um arquivo de log com timestamp.
 * =================================================================================
 */
import { spawn, execSync } from 'child_process'; // Usar spawn para streaming e execSync para comandos síncronos
import fs from 'fs';
import path from 'path';

/**
 * Gera um caminho de arquivo de log único com base na data e hora atuais.
 * @returns {string} O caminho completo para o arquivo de log.
 */
function createLogFilePath() {
    const now = new Date(); // Gera um timestamp mais robusto e multiplataforma
    const YYYY = now.getFullYear(); // Ano com 4 dígitos
    const MM = String(now.getMonth() + 1).padStart(2, '0'); // Mês (01-12)
    const DD = String(now.getDate()).padStart(2, '0'); // Dia (01-31)
    const HH = String(now.getHours()).padStart(2, '0'); // Hora (00-23)
    const mm = String(now.getMinutes()).padStart(2, '0'); // Minuto (00-59)
    const ss = String(now.getSeconds()).padStart(2, '0'); // Segundo (00-59)
    const timestamp = `${YYYY}-${MM}-${DD}_${HH}-${mm}-${ss}`; // Formato: YYYY-MM-DD_HH-mm-ss
    
    const logDir = path.join('Testes', 'resultados');
    // Garante que o diretório de resultados exista
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    return path.join(logDir, `log_${timestamp}.txt`);
}

/**
 * Copia o CAMINHO de um arquivo para a área de transferência usando PowerShell.
 * @param {string} filePath - O caminho do arquivo a ser copiado.
 */
function copyLogPathToClipboard(filePath) {
    // Verifica se o sistema operacional é Windows para garantir a compatibilidade do comando.
    if (process.platform === 'win32') {
        // Usa Set-Clipboard para copiar o valor do caminho do arquivo.
        // O caminho absoluto é usado para garantir que funcione de qualquer diretório.
        const absolutePath = path.resolve(filePath);
        execSync(`powershell -command "Set-Clipboard -Value '${absolutePath}'"`);
        console.log(`\n[1] 📋 Caminho do log copiado para a área de transferência: ${absolutePath}`);
    }
}

/**
 * Analisa o conteúdo do log para extrair e exibir um resumo dos resultados.
 * @param {string} logContent - O conteúdo completo do arquivo de log.
 */
function summarizeResults(logContent) {
    const failedSuites = [...logContent.matchAll(/FAIL\s+(Testes\/.*?\.test\.js)/g)].map(m => m[1]);
    const passedSuites = [...logContent.matchAll(/PASS\s+(Testes\/.*?\.test\.js)/g)].map(m => m[1]);

    console.log('\n\n==================== RESUMO DOS TESTES ====================');
    if (failedSuites.length > 0) {
        console.log('\n❌ SUÍTES COM FALHA:');
        failedSuites.forEach(suite => console.log(`  - ${suite}`));
    }

    if (passedSuites.length > 0) {
        console.log('\n✅ SUÍTES COM SUCESSO:');
        passedSuites.forEach(suite => console.log(`  - ${suite}`));
    }
    console.log('\n=========================================================');

}

const logFilePath = createLogFilePath();

/**
 * Executa os testes com Jest e gerencia o output.
 * MOTIVO DA MUDANÇA: Substituído `execSync` por `spawn` para fornecer feedback em tempo real no console.
 * `execSync` bloqueia o console até o fim, dando a impressão de que o processo travou.
 * `spawn` permite que a saída do Jest seja exibida no console assim que é gerada.
 */
async function runTests() {
    return new Promise((resolve, reject) => {
        const jestCommand = 'node';
        const jestArgs = [
            '--experimental-vm-modules',
            './node_modules/jest/bin/jest.js',
            '--config',
            './Testes/config/jest.config.cjs',
            '--runInBand'
        ];

        const child = spawn(jestCommand, jestArgs);

        let fullOutput = '';

        // Captura a saída padrão (stdout) em tempo real
        child.stdout.on('data', (data) => {
            const chunk = data.toString();
            process.stdout.write(chunk); // Exibe no console imediatamente
            fullOutput += chunk; // Acumula para o arquivo de log
        });

        // Captura a saída de erro (stderr) em tempo real
        child.stderr.on('data', (data) => {
            const chunk = data.toString();
            process.stderr.write(chunk); // Exibe no console de erro imediatamente
            fullOutput += chunk; // Acumula para o arquivo de log
        });

        child.on('close', (code) => {
            const endMarker = `\n--- FIM DOS TESTES AUTOMATIZADOS (Status: ${code === 0 ? 'Sucesso' : 'Falha'}) ---\n`;
            process.stdout.write(endMarker);
            fullOutput += endMarker;

            // Remove códigos de cor para o arquivo de log
            const cleanOutput = fullOutput.replace(/\x1b\[[0-9;]*m/g, '');
            fs.writeFileSync(logFilePath, cleanOutput);
            summarizeResults(cleanOutput); // Exibe o resumo dos resultados
            copyLogPathToClipboard(logFilePath);

            if (code === 0) {
                console.log('\n[1] ✅ Testes concluídos com sucesso.');
                resolve();
            } else {
                console.error('\n[1] ❌ Ocorreram erros durante a execução dos testes. Verifique o log para mais detalhes.');
                reject(new Error(`Testes falharam com código de saída ${code}`));
            }
        });
    });
}

runTests().catch(() => {
    // Garante que o processo do Node.js termine com um código de erro se a promise for rejeitada,
    // o que é importante para integrações contínuas (CI/CD).
    process.exit(1);
});