/**
 * @file Script para executar os testes do Jest e salvar a saída em um arquivo de log.
 * @description Este script gera um nome de arquivo com timestamp, executa o Jest
 * com a saída redirecionada para este arquivo e, ao final, exibe uma mensagem de confirmação.
 */
import { execSync } from 'child_process'; // Usar execSync para capturar a saída de forma síncrona
import fs from 'fs';
import path from 'path';

/**
 * Gera um nome de arquivo de log com timestamp.
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

// Revertido para a versão funcional que executa o Jest
const logFilePath = createLogFilePath();

try {
    /*
    ==================================================================================
    COMENTÁRIO IMPORTANTE:
    Este bloco é o coração da geração de logs e da exibição no console.

    1.  `jestCommand`: Executa o Jest com as flags necessárias.
    2.  `execSync`: Roda o comando e captura TODA a sua saída (stdout e stderr).
    3.  `process.stdout.write(rawOutput)`: Imprime a saída capturada (com cores) no console.
    4.  `rawOutput.replace(...)`: Remove os códigos de cor ANSI.
    5.  `fs.writeFileSync(...)`: Salva a saída limpa no arquivo .txt.

    NÃO MODIFICAR ESTE BLOCO PARA GARANTIR A CRIAÇÃO E FORMATAÇÃO CORRETA DOS LOGS.
    ==================================================================================
    */
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