// =================================================================================
// ARQUIVO: controllers/clientController.js
// DESCRIÇÃO: Controladores para as operações CRUD relacionadas a Clientes e
//            Fornecedores (entidade 'Client'). Garante que todas as operações
//            sejam executadas dentro do escopo da empresa do usuário autenticado.
// =================================================================================

import Client from "../models/Client.js";
import { createLog } from "../utils/logger.js";

/**
 * Lista todos os clientes/fornecedores da empresa do usuário autenticado.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getAllClients = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const clients = await Client.find({ companyId: companyId }).sort({ name: 1 });
    return res.status(200).json(clients);
  } catch (error) {
    console.error("getAllClients:", error);
    return res.status(500).json({ message: "Erro ao listar clientes", error: error.message });
  }
};

/**
 * Cria um novo cliente ou fornecedor.
 * O tipo ('client' ou 'supplier') é definido no corpo da requisição.
 * O novo registro é automaticamente associado à empresa e ao usuário que o criou.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const createClient = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const userId = req.user.userId; // userId já é ObjectId do authMiddleware
    const payload = { ...req.body, companyId: companyId, userId: userId };
    const client = await Client.create(payload);

    // Registra um log de auditoria detalhado para a criação.
    await createLog({
      userId,
      companyId,
      action: "CREATE_CLIENT",
      description: `Client criado: ${client.name}`,
      route: req.originalUrl,
    });

    return res.status(201).json(client);
  } catch (error) {
    console.error("createClient:", error);
    return res.status(500).json({ message: "Erro ao criar client", error: error.message });
  }
};

/**
 * Atualiza um cliente/fornecedor existente.
 * A busca é feita pelo ID do cliente e pelo ID da empresa para garantir a segurança.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const updateClient = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, companyId: companyId },
      { $set: req.body }, // req.body já deve ter os campos padronizados
      { new: true }
    );
    if (!client) return res.status(404).json({ message: "Client não encontrado" });

    await createLog({
      userId: req.user.userId,
      companyId,
      action: "UPDATE_CLIENT",
      description: `Client atualizado: ${client.name}`,
      route: req.originalUrl,
    });

    return res.status(200).json(client);
  } catch (error) {
    console.error("updateClient:", error);
    return res.status(500).json({ message: "Erro ao atualizar client", error: error.message });
  }
};

/**
 * Exclui um cliente/fornecedor existente.
 * A operação também é restrita ao escopo da empresa do usuário.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const deleteClient = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const removed = await Client.findOneAndDelete({ _id: req.params.id, companyId: companyId });
    if (!removed) return res.status(404).json({ message: "Client não encontrado" });

    await createLog({
      userId: req.user.userId,
      companyId,
      action: "DELETE_CLIENT",
      description: `Client removido: ${removed.name}`,
      route: req.originalUrl,
    });

    return res.status(200).json({ message: "Client removido com sucesso" });
  } catch (error) {
    console.error("deleteClient:", error);
    return res.status(500).json({ message: "Erro ao remover client", error: error.message });
  }
};
