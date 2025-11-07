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
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${YYYY}-${MM}-${DD}_${HH}-${mm}-${ss}`;
    
    const logDir = path.join('Testes', 'resultados');
    // Garante que o diretório de resultados exista
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    return path.join(logDir, `log_${timestamp}.txt`);
}

const logFilePath = createLogFilePath();

try {
    // Comando para executar o Jest. As flags são importantes:
    // --experimental-vm-modules: Habilita o suporte a ES Modules nos testes.
    // --runInBand: Executa os testes sequencialmente, o que é ideal para testes de integração que dependem de estado.
    // --forceExit: Força o Jest a sair após a conclusão dos testes, evitando processos pendentes.
    const jestCommand = `node --experimental-vm-modules ./node_modules/jest/bin/jest.js --config ./Testes/jest.config.cjs --runInBand --forceExit`;

    // Executa o Jest e captura a saída completa (incluindo códigos ANSI para cores).
    let rawOutput = execSync(jestCommand, { encoding: 'utf8', stdio: 'pipe' }); // Alterado para let

    // Adiciona um marcador de fim de testes
    const endMarker = "\n--- FIM DOS TESTES AUTOMATIZADOS ---\n";
    rawOutput += endMarker; // Adiciona ao output bruto para console e arquivo

    // Imprime a saída bruta (com cores) no console.
    process.stdout.write(rawOutput);

    // Remove os códigos de formatação ANSI para o arquivo de log.
    const cleanOutput = rawOutput.replace(/\x1b\[[0-9;]*m/g, '');
    fs.writeFileSync(logFilePath, cleanOutput);
    
    console.log('\n[1] ✅ Testes validados com sucesso');

} catch (error) {
    // Se o Jest falhar, execSync lançará um erro. Capturamos a saída e o erro para o log.
    let rawOutput = error.stdout ? error.stdout.toString() : ''; // Alterado para let
    let rawError = error.stderr ? error.stderr.toString() : ''; // Alterado para let

    // Adiciona um marcador de fim de testes (mesmo em caso de erro)
    const endMarker = "\n--- FIM DOS TESTES AUTOMATIZADOS (COM FALHAS) ---\n";
    rawOutput += endMarker; // Adiciona ao output bruto para console e arquivo

    process.stdout.write(rawOutput); // Imprime a saída no console
    process.stderr.write(rawError); // Imprime o erro no console
    
    const cleanOutput = (rawOutput + rawError).replace(/\x1b\[[0-9;]*m/g, '');
    fs.writeFileSync(logFilePath, cleanOutput);

    console.error('\n[1] ❌ Ocorreram erros durante a execução dos testes. Verifique o log para mais detalhes.');

    process.exit(1); // Garante que o comando de teste saia com um código de falha
}