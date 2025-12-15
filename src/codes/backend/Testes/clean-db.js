// clean-db.js
import mongoose from "mongoose";
import dotenv from 'dotenv';

// Ajuste os caminhos se necessário para importar seus modelos
import Alert from "../models/Alert.js"; // Caminho já estava correto, mantido.
import Client from "../models/Client.js"; // Caminho já estava correto, mantido.
import Company from "../models/Company.js"; // Caminho já estava correto, mantido.
import Goal from "../models/Goal.js"; // Caminho já estava correto, mantido.
import Log from "../models/Logs.js"; // CORREÇÃO: O nome do arquivo é Logs.js (plural)
import Permission from "../models/Permission.js"; // Caminho já estava correto, mantido.
import SessionToken from "../models/SessionToken.js"; // Caminho já estava correto, mantido.
import Transaction from "../models/Transaction.js"; // Caminho já estava correto, mantido.
import User from "../models/User.js"; // Caminho já estava correto, mantido.

dotenv.config();

// Usa a variável de desenvolvimento por padrão, garantindo que este script
// limpe o banco de dados correto para o ambiente de desenvolvimento.
const dbURI = process.env.MONGO_URI_DEV; 

if (!dbURI) {
    console.error("🔴 ERRO: A variável de ambiente MONGO_URI_DEV não está definida.");
    process.exit(1);
}

const cleanDatabase = async () => {
    try {
        console.log('--- ⏳ Conectando ao banco de dados para limpeza...');
        await mongoose.connect(dbURI);
        console.log('✅ Conectado!');

        console.log('--- 🧹 Limpando o banco de dados ---');
        
        // Lista de coleções para limpar, incluindo as que não são mais usadas
        const collectionsToClean = [
            'transactions',
            'clients', // O Mongoose por padrão pluraliza 'Client' para 'clients'
            'goals',
            'users',
            'companies',
            'permissions',
            'sessiontokens',
            'alerts',
            'logs',
            'empresas', // Coleção antiga
            'metas'     // Coleção antiga
        ];
        
        for (const collectionName of collectionsToClean) {
            try {
                await mongoose.connection.collection(collectionName).deleteMany({});
                console.log(`- Coleção '${collectionName}' limpa.`);
            } catch (err) {
                if (err.codeName !== 'NamespaceNotFound') {
                    console.warn(`- Aviso ao limpar '${collectionName}': ${err.message}`);
                }
            }
        }
        
        console.log('\n✅ Banco de dados limpo com sucesso!');
    } catch (error) {
        console.error('🔴 Erro durante a limpeza do banco de dados:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Desconectado do banco de dados.');
        process.exit();
    }
};

cleanDatabase();