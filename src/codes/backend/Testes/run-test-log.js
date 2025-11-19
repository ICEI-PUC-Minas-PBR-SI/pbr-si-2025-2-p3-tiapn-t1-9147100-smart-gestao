/**
 * =================================================================================
 * ARQUIVO: Testes/run-test-log.js
 *
 * DESCRIÇÃO:
 *            Este script serve como um "invólucro" (wrapper) para a execução dos
 *            testes com Jest. Sua principal responsabilidade é capturar toda a
 *            saída do console gerada pelo Jest e salvá-la em um arquivo de log
 *            com timestamp na pasta `Testes/resultados/`.
 *
 *            Ele também fornece feedback em tempo real no console, mostrando o
 *            progresso dos testes.
 * =================================================================================
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import clipboardy from 'clipboardy';

const testPath = process.argv[2] || ''; // Pega o caminho do teste do argumento da linha de comando
const resultsDir = path.join('Testes', 'resultados');

// Garante que o diretório de resultados exista
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Cria um nome de arquivo de log com timestamp
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');

// Monta o timestamp no formato local (YYYY-MM-DD_HH-mm-ss)
const localTimestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
const logFileName = `log_${localTimestamp}.txt`;
const logFilePath = path.join(resultsDir, logFileName);

// Cria um stream de escrita para o arquivo de log, que é mais eficiente para grandes volumes de dados.
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

console.log(`--- INICIANDO TESTES AUTOMATIZADOS (Log em: ${logFilePath}) ---`);

// Constrói o comando Jest completo, incluindo as flags necessárias para ES Modules
const jestCommand = 'cross-env';
const jestArgs = [
  'FORCE_COLOR=0', // CORREÇÃO: Força a desativação da saída de cores para logs limpos.
  'NODE_OPTIONS=--experimental-vm-modules', // Mantém a flag para módulos ES.
  'jest',
  '--config',
  './Testes/config/jest.config.cjs',
  '--runInBand', // Garante que os arquivos de teste rodem em sequência, evitando condições de corrida.
  testPath, // Adiciona o caminho específico do teste, se fornecido
].filter(Boolean); // Remove argumentos vazios
const options = {
  stdio: ['inherit', 'pipe', 'pipe'], // Herda stdin, mas captura stdout e stderr
  shell: true, // Necessário para que `cross-env` funcione corretamente em diferentes OS
};
// Inicia o processo de teste do Jest.
const jestProcess = spawn(jestCommand, jestArgs, options);

// Redireciona o stdout do Jest para o console e para o arquivo de log
jestProcess.stdout.on('data', (data) => {
  process.stdout.write(data);
  logStream.write(data);
});

// Redireciona o stderr do Jest para o console e para o arquivo de log
jestProcess.stderr.on('data', (data) => {
  process.stderr.write(data);
  logStream.write(data);
});

// Ao final do processo, exibe um resumo e copia o caminho do log para a área de transferência.
jestProcess.on('close', (code) => {
  logStream.end();
  console.log('\n--- FIM DOS TESTES AUTOMATIZADOS ---');
  clipboardy.writeSync(path.resolve(logFilePath));
  console.log(`[1] 📋 Caminho do log copiado para a área de transferência: ${path.resolve(logFilePath)}`);
  if (code === 0) {
    console.log('[1] ✅ Testes concluídos com sucesso.');
  } else {
    console.log(`[1] ❌ Ocorreram erros durante a execução dos testes. Verifique o log para mais detalhes.`);
  }
});