// controllers/permissionController.js

import Permission from "../models/Permission.js";
import { createLog } from "../utils/logger.js";

export const getAllPermissions = async (req, res) => {
  try {
    const items = await Permission.find().sort({ name: 1 });
    return res.status(200).json(items);
  } catch (error) {
    console.error("getAllPermissions:", error);
    return res.status(500).json({ message: "Erro ao listar permissões", error: error.message });
  }
};

export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "name é obrigatório" });

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
    console.error("createPermission:", error);
    return res.status(500).json({ message: "Erro ao criar permissão", error: error.message });
  }
};

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
