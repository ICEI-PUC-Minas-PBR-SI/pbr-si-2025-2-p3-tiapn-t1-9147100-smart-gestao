// controllers/clientController.js
// CRUD para clients (clientes e suppliers)

import Client from "../models/Client.js";
import { createLog } from "../utils/logger.js";

/**
 * - GET /api/clients
 * Lista todos clients da company do usuário
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
 * - POST /api/clients
 * Cria client (tipo: 'client' | 'supplier')
 */
export const createClient = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const userId = req.user.userId; // userId já é ObjectId do authMiddleware
    // Payload alinhado com o modelo padronizado
    const payload = { ...req.body, companyId: companyId, userId: userId };
    const client = await Client.create(payload);

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
 * - PUT /api/clients/:id
 * Atualiza client (somente na mesma company)
 */
export const updateClient = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, companyId: companyId }, // Padronizado para companyId
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
 * - DELETE /api/clients/:id
 * Remove client (dentro da company)
 */
export const deleteClient = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const removed = await Client.findOneAndDelete({ _id: req.params.id, companyId: companyId }); // Padronizado para companyId
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
