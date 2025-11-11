import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function teardown() {
  console.log('\n--- 🧹 [TEARDOWN] Finalizando ambiente de testes e fechando conexão ---');
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    console.log('--- ✅ Conexão com o banco de dados de teste fechada ---');
  }
  // Opcional: descomente a linha abaixo para apagar o arquivo de dados de teste ao final.
  // fs.unlinkSync(path.join(__dirname, 'test-setup.json'));
}