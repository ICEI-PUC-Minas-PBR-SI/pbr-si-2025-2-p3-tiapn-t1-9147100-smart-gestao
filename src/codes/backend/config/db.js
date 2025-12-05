// =============================================================================
// ARQUIVO: config/db.js
// DESCRIÇÃO: Contém a função para configurar e estabelecer a conexão com o
//            banco de dados MongoDB. Este módulo é central para a operação
//            do backend, pois garante que a aplicação possa persistir e
//            recuperar dados.
// =============================================================================

import mongoose from "mongoose";
import dotenv from "dotenv";

// Inicializa o `dotenv` para carregar as variáveis de ambiente do arquivo .env.
// Isso permite que o código acesse informações sensíveis, como a string de
// conexão do MongoDB, de forma segura, sem "hardcoding".
dotenv.config();

/**
 * Estabelece a conexão com o banco de dados MongoDB.
 * A função é assíncrona, pois a operação de conexão é baseada em Promises.
 * Utiliza a string de conexão `MONGO_URI` definida no arquivo de ambiente `.env`.
 * Em caso de sucesso, exibe uma mensagem de confirmação no console.
 * Em caso de falha, exibe uma mensagem de erro detalhada e encerra o processo
 * da aplicação com um código de status 1 para evitar comportamentos inesperados.
 */
export const connectDB = async (dbUri) => {
  try {
    // Validação para garantir que a URI de conexão foi fornecida.
    if (!dbUri) {
      throw new Error("A URI de conexão com o MongoDB não foi fornecida.");
    }

    // Tenta estabelecer a conexão com o MongoDB usando a URI e as opções de configuração.
    // As opções `useNewUrlParser` e `useUnifiedTopology` são recomendadas pelo Mongoose
    // para garantir a compatibilidade com as versões mais recentes do driver do MongoDB.
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Conexão com o MongoDB estabelecida com sucesso.");
  } catch (error) {
    // Se ocorrer um erro durante a tentativa de conexão, ele será capturado aqui.
    console.error("Erro ao conectar com o MongoDB:", error.message);
    // Encerra a execução da aplicação com um código de erro. Isso é uma prática de
    // segurança para prevenir que a aplicação continue rodando sem acesso ao banco de dados.
    process.exit(1);
  }
};
