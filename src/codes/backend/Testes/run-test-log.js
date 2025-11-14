/**
 * =================================================================================
 * ARQUIVO: Testes/run-test-log.js
 *
 * DESCRIÇÃO:
 *            Este script é o ponto de entrada para a execução da suíte de testes
 *            completa (`npm test`). Sua principal responsabilidade é invocar o Jest
 *            com as configurações corretas e, simultaneamente, capturar toda a
 *            saída do console para um arquivo de log timestamped, facilitando a
 *            análise e o registro histórico dos resultados.
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
    // Pega o caminho do teste a ser executado a partir dos argumentos da linha de comando.
    // Se nenhum caminho for fornecido, o Jest rodará todos os testes.
    const testPath = process.argv[2] || '';

    return new Promise((resolve, reject) => {
        // MOTIVO DA MUDANÇA: `spawn` no Windows não resolve `cross-env` automaticamente.
        // Usamos `npx` (ou `npx.cmd` no Windows) para garantir que o executável seja encontrado
        // dentro de `node_modules/.bin`. A opção `{ shell: true }` é a forma mais robusta de
        // garantir que o comando seja executado corretamente em qualquer plataforma (Windows, Linux, macOS).
        const jestCommand = 'npx';
        const jestArgs = [
            'cross-env', 
            'NODE_OPTIONS=--experimental-vm-modules',
            'jest',
            '--config',
            'Testes/config/jest.config.cjs',
            '--runInBand'
        ];

        if (testPath) jestArgs.push(testPath);
        const child = spawn(jestCommand, jestArgs, { stdio: 'pipe', shell: true });

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