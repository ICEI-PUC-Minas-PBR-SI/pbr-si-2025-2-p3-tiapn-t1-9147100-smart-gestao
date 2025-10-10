// ===========================================
// Arquivo: controllers/ClientController.js
// Descrição: CRUD para clientes e fornecedores
// ===========================================

import Client from "../models/Client.js";
import { createLog } from "../utils/logger.js";

/**
 * Cria um novo cliente ou fornecedor vinculado à empresa do usuário logado.
 */
export const createClient = async (req, res) => {
  try {
    const empresaId = req.user.companyId;
    const client = await Client.create({ ...req.body, companyId: empresaId });

    await createLog(req, "CREATE_CLIENT", `Cliente/Fornecedor criado: ${client.nome_razao}`);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar cliente", error: error.message });
  }
};

/**
 * Lista todos os clientes/fornecedores da empresa logada.
 */
export const getClients = async (req, res) => {
  try {
    const empresaId = req.user.companyId;
    const clients = await Client.find({ companyId: empresaId });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar clientes", error: error.message });
  }
};
