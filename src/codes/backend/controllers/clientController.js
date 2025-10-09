// ===========================================
// Arquivo: controllers/clientController.js
// Função: CRUD para clientes e fornecedores
// ===========================================

import Client from "../models/Client.js";
import { createLog } from "../config/logger.js";

/**
 * Listar clientes e fornecedores
 */
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find({ companyId: req.user.companyId });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar clientes/fornecedores", error });
  }
};

/**
 * Criar novo cliente/fornecedor
 */
export const createClient = async (req, res) => {
  try {
    const client = new Client({
      ...req.body,
      companyId: req.user.companyId,
    });
    await client.save();

    await createLog({
      userId: req.user.userId,
      companyId: req.user.companyId,
      action: "CREATE_CLIENT",
      description: `Cliente/Fornecedor criado: ${client.name}`,
      route: req.originalUrl,
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar cliente/fornecedor", error });
  }
};
