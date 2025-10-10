// ===========================================
// controllers/permissionController.js
// Função: CRUD para Permission (papéis/roles)
// Observação: normalmente executado por ROOT (owner do sistema).
// ===========================================

import Permission from "../models/Permission.js";
import { createLog } from "../utils/logger.js";

/**
 * GET /api/permissions
 * Retorna lista de permissões (roles) do sistema.
 */
export const getAllPermissions = async (req, res) => {
  try {
    const items = await Permission.find().sort({ name: 1 });
    return res.status(200).json(items);
  } catch (error) {
    console.error("Erro em getAllPermissions:", error);
    return res.status(500).json({ message: "Erro ao listar permissões", error: error.message });
  }
};

/**
 * POST /api/permissions
 * Cria uma permissão/role.
 * Body: { name: "ADMIN_COMPANY", description: "..." }
 */
export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Evita duplicidade
    const exists = await Permission.findOne({ name: name.toUpperCase() });
    if (exists) return res.status(400).json({ message: "Permissão já existe" });

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
    console.error("Erro em createPermission:", error);
    return res.status(500).json({ message: "Erro ao criar permissão", error: error.message });
  }
};

/**
 * PUT /api/permissions/:id
 * Atualiza permissão existente.
 */
export const updatePermission = async (req, res) => {
  try {
    const perm = await Permission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!perm) return res.status(404).json({ message: "Permissão não encontrada" });

    await createLog({
      userId: req.user.userId,
      companyId: req.user.companyId,
      action: "UPDATE_PERMISSION",
      description: `Permissão atualizada: ${perm.name}`,
      route: req.originalUrl,
    });

    return res.status(200).json(perm);
  } catch (error) {
    console.error("Erro em updatePermission:", error);
    return res.status(500).json({ message: "Erro ao atualizar permissão", error: error.message });
  }
};

/**
 * DELETE /api/permissions/:id
 * Remove permissão (em produção, prefira desativação lógica).
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
    console.error("Erro em deletePermission:", error);
    return res.status(500).json({ message: "Erro ao remover permissão", error: error.message });
  }
};
