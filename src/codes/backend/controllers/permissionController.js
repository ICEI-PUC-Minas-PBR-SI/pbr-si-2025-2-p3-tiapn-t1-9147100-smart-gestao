// =================================================================================
// ARQUIVO: controllers/permissionController.js
// DESCRIÇÃO: Controladores para o gerenciamento de Permissões de acesso do sistema.
//            Estas operações são críticas para a segurança e geralmente devem ser
//            acessíveis apenas por usuários com o nível mais alto de privilégio (ex: ROOT).
// =================================================================================

import Permission from "../models/Permission.js";
import { createLog } from "../utils/logger.js";

/**
 * Lista todas as permissões de acesso cadastradas no sistema.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getAllPermissions = async (req, res) => {
  try {
    const items = await Permission.find().sort({ name: 1 }); // Busca todas as permissões
    return res.status(200).json(items);
  } catch (error) {
    console.error("getAllPermissions:", error);
    return res.status(500).json({ message: "Erro ao listar permissões", error: error.message });
  }
};

/**
 * Cria uma nova permissão de acesso.
 * O nome da permissão é convertido para maiúsculas para manter a consistência.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "O campo 'name' é obrigatório." });

    // Garante que o nome da permissão seja único.
    const exists = await Permission.findOne({ name: name.toUpperCase() });
    if (exists) return res.status(409).json({ message: "Uma permissão com este nome já existe." });

    const perm = await Permission.create({ name: name.toUpperCase(), description });

    await createLog({
      userId: req.user.userId,
      companyId: req.user.companyId,
      action: "CREATE_PERMISSION",
      description: `Permissão criada: ${perm.name}`,
      route: req.originalUrl,
    });

    return res.status(201).json(perm);
  } catch (error) {
    console.error("createPermission:", error);
    return res.status(500).json({ message: "Erro ao criar permissão", error: error.message });
  }
};

/**
 * Atualiza a descrição de uma permissão existente, identificada pelo ID.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const updatePermission = async (req, res) => {
  try {
    const updated = await Permission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Permissão não encontrada" });

    await createLog({
      userId: req.user.userId,
      companyId: req.user.companyId,
      action: "UPDATE_PERMISSION",
      description: `Permissão atualizada: ${updated.name}`,
      route: req.originalUrl,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("updatePermission:", error);
    return res.status(500).json({ message: "Erro ao atualizar permissão", error: error.message });
  }
};

/**
 * Exclui uma permissão do sistema.
 * Esta é uma operação perigosa e deve ser usada com cautela, pois pode afetar usuários existentes.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const deletePermission = async (req, res) => {
  try {
    const removed = await Permission.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Permissão não encontrada" });

    await createLog({
      userId: req.user.userId,
      companyId: req.user.companyId,
      action: "DELETE_PERMISSION",
      description: `Permissão removida: ${removed.name}`,
      route: req.originalUrl,
    });

    return res.status(200).json({ message: "Permissão removida" });
  } catch (error) {
    console.error("deletePermission:", error);
    return res.status(500).json({ message: "Erro ao remover permissão", error: error.message });
  }
};
