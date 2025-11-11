/**
 * =================================================================================
 * ARQUIVO: Testes/run-test-log.js
 * DESCRIÇÃO: Script executor para a suíte de testes automatizados.
 *            Ele orquestra a execução do Jest, captura toda a saída (incluindo
 *            cores) para exibição no console e, simultaneamente, salva uma
 *            versão limpa (sem códigos de cor) em um arquivo de log com timestamp.
 * =================================================================================
 */
import { execSync } from 'child_process'; // Usar execSync para capturar a saída de forma síncrona
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

const logFilePath = createLogFilePath();

// MOTIVO DA MUDANÇA: A orquestração com `concurrently` e `wait-on` foi movida
// para o script `test` no `package.json`. Este script (`run-test-log.js`)
// agora tem a responsabilidade única de EXECUTAR o Jest e gerenciar a saída do log.
try {
    // Comando para executar o Jest. As flags são importantes:
    // --experimental-vm-modules: Habilita o suporte a ES Modules nos testes.
    // --runInBand: Executa os testes sequencialmente, o que é ideal para testes de integração que dependem de estado.
    const jestCommand = `node --experimental-vm-modules ./node_modules/jest/bin/jest.js --config ./Testes/jest.config.cjs --runInBand`;

    // Executa o Jest e captura a saída completa (incluindo códigos ANSI para cores).
    let rawOutput = execSync(jestCommand, { encoding: 'utf8', stdio: 'pipe' });

    // Adiciona um marcador de fim de testes
    const endMarker = "\n--- FIM DOS TESTES AUTOMATIZADOS ---\n";
    rawOutput += endMarker; // Adiciona ao output bruto para console e arquivo

    // Imprime a saída bruta (com cores) no console.
    process.stdout.write(rawOutput);

    // Remove os códigos de formatação ANSI para o arquivo de log.
    const cleanOutput = rawOutput.replace(/\x1b\[[0-9;]*m/g, '');
    fs.writeFileSync(logFilePath, cleanOutput); // Salva o log limpo

    // Copia o caminho do log para a área de transferência
    copyLogPathToClipboard(logFilePath);

    console.log('\n[1] ✅ Testes concluídos.'); // Mensagem final de sucesso

} catch (error) {
    // Se o Jest falhar, execSync lançará um erro. Capturamos a saída e o erro para o log.
    let rawOutput = error.stdout ? error.stdout.toString() : '';
    let rawError = error.stderr ? error.stderr.toString() : '';

    const endMarker = "\n--- FIM DOS TESTES AUTOMATIZADOS (COM FALHAS) ---\n";
    rawOutput += endMarker; // Adiciona ao output bruto para console e arquivo

    process.stdout.write(rawOutput); // Imprime a saída no console
    process.stderr.write(rawError); // Imprime o erro no console
    
    const cleanOutput = (rawOutput + rawError).replace(/\x1b\[[0-9;]*m/g, '');
    fs.writeFileSync(logFilePath, cleanOutput); // Salva o log limpo

    copyLogPathToClipboard(logFilePath); // Copia o caminho do log para a área de transferência

    console.error('\n[1] ❌ Ocorreram erros durante a execução dos testes. Verifique o log para mais detalhes.'); // Mensagem final de erro

    process.exit(1); // Garante que o comando de teste saia com um código de falha
}