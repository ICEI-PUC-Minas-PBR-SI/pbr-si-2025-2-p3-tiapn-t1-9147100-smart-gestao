// ===========================================
// Arquivo: config/logger.js
// Função: Gerar logs de auditoria no console e salvar no banco de dados
// ===========================================

import Logs from "../models/Logs.js";

/**
 * Função auxiliar para registrar logs de operações do sistema.
 * Armazena as informações no banco e também exibe no console.
 * @param {Object} logData - Dados a serem salvos no log
 */
export const createLog = async (logData) => {
  try {
    // Criação do log no MongoDB
    const newLog = new Logs({
      ...logData,
      createdAt: new Date(),
    });
    await newLog.save();

    // Exibição simplificada no console
    console.log(`🧾 [${logData.action}] - Usuário: ${logData.userId} | Empresa: ${logData.companyId} | ${new Date().toLocaleString()}`);
  } catch (error) {
    console.error("❌ Falha ao salvar log de auditoria:", error.message);
  }
};
