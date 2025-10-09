// ===========================================
// Arquivo: controllers/permissionController.js
// Função: CRUD simples para Permissões (roles/permissions)
// Obs: usado para popular e gerenciar papéis do sistema.
// ===========================================

import Permission from "../models/Permission.js";
import { createLog } from "../utils/logger.js";

/**
 * Listar todas as permissões do sistema.
 * Normalmente utilizado pelo administrativo para visualizar roles existentes.
 */
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ name: 1 }); // ordena alfabeticamente
    return res.status(200).json(permissions);
  } catch (error) {
    console.error("Erro em getAllPermissions:", error);
    return res.status(500).json({ message: "Erro ao listar permissões", error });
  }
};

/**
 * Criar uma nova permissão (role).
 * Ex.: { name: "ADMIN_COMPANY", description: "Administrador da empresa" }
 * Somente usuários com role apropriada (ex.: ROOT) devem executar isso — verificar nas rotas.
 */
export const createPermission = async (req, res) => {
  try {
    const payload = req.body;

    const exists = await Permission.findOne({ name: payload.name });
    if (exists) {
      return res.status(400).json({ message: "Permissão já existe" });
    }

    const permission = new Permission(payload);
    await permission.save();

    // Log da operação
    await createLog({
      userId: req.user?.userId || null,
      companyId: req.user?.companyId || null,
      action: "CREATE_PERMISSION",
      description: `Permissão criada: ${permission.name}`,
      route: req.originalUrl,
    });

    return res.status(201).json(permission);
  } catch (error) {
    console.error("Erro em createPermission:", error);
    return res.status(500).json({ message: "Erro ao criar permissão", error });
  }
};

/**
 * Atualizar uma permissão existente.
 * Parâmetro: req.params.id -> id da permissão
 */
export const updatePermission = async (req, res) => {
  try {
    const updated = await Permission.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: "Permissão não encontrada" });

    await createLog({
      userId: req.user?.userId || null,
      companyId: req.user?.companyId || null,
      action: "UPDATE_PERMISSION",
      description: `Permissão atualizada: ${updated.name}`,
      route: req.originalUrl,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Erro em updatePermission:", error);
    return res.status(500).json({ message: "Erro ao atualizar permissão", error });
  }
};

/**
 * Remover (deletar) uma permissão.
 * Atenção: em ambiente real, prefira flag de "ativo" em vez de remover fisicamente.
 */
export const deletePermission = async (req, res) => {
  try {
    const removed = await Permission.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Permissão não encontrada" });

    await createLog({
      userId: req.user?.userId || null,
      companyId: req.user?.companyId || null,
      action: "DELETE_PERMISSION",
      description: `Permissão removida: ${removed.name}`,
      route: req.originalUrl,
    });

    return res.status(200).json({ message: "Permissão removida com sucesso" });
  } catch (error) {
    console.error("Erro em deletePermission:", error);
    return res.status(500).json({ message: "Erro ao remover permissão", error });
  }
};
