import dotenv from 'dotenv';
import path from 'path';

// Carrega as variáveis de ambiente do arquivo .env localizado na pasta raiz do backend.
// Este script é executado pelo Jest antes de qualquer teste, garantindo que
// process.env.MONGO_URI e outras variáveis estejam disponíveis globalmente.
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });