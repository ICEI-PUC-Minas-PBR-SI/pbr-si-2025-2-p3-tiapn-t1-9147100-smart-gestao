// controllers/metaController.js
// CRUD de financial goals (metas)

import Meta from "../models/Meta.js";
import { createLog } from "../utils/logger.js";

/**
 * GET /api/meta
 * Lista metas da company
 */
export const getAllMetas = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const items = await Meta.find({ companyId }).sort({ startDate: -1 });
    return res.status(200).json(items);
  } catch (error) {
    console.error("getAllMetas:", error);
    return res.status(500).json({ message: "Erro ao listar metas", error: error.message });
  }
};

/**
 * POST /api/meta
 * Cria meta financeira
 */
export const createMeta = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    const payload = { ...req.body, companyId };

    const meta = await Meta.create(payload);

    await createLog({
      userId,
      companyId,
      action: "CREATE_META",
      description: `Meta criada: ${meta._id}`,
      route: req.originalUrl,
    });

    return res.status(201).json(meta);
  } catch (error) {
    console.error("createMeta:", error);
    return res.status(500).json({ message: "Erro ao criar meta", error: error.message });
  }
};

/**
 * PUT /api/meta/:id
 * Atualiza meta
 */
export const updateMeta = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const meta = await Meta.findOneAndUpdate({ _id: req.params.id, companyId }, { $set: req.body }, { new: true });
    if (!meta) return res.status(404).json({ message: "Meta não encontrada" });

    await createLog({
      userId: req.user.userId,
      companyId,
      action: "UPDATE_META",
      description: `Meta atualizada: ${meta._id}`,
      route: req.originalUrl,
    });

    return res.status(200).json(meta);
  } catch (error) {
    console.error("updateMeta:", error);
    return res.status(500).json({ message: "Erro ao atualizar meta", error: error.message });
  }
};

/**
 * DELETE /api/meta/:id
 * Remove meta (física) — em produção prefira marcar active=false
 */
export const deleteMeta = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const removed = await Meta.findOneAndDelete({ _id: req.params.id, companyId });
    if (!removed) return res.status(404).json({ message: "Meta não encontrada" });

    await createLog({
      userId: req.user.userId,
      companyId,
      action: "DELETE_META",
      description: `Meta removida: ${removed._id}`,
      route: req.originalUrl,
    });

    return res.status(200).json({ message: "Meta removida com sucesso" });
  } catch (error) {
    console.error("deleteMeta:", error);
    return res.status(500).json({ message: "Erro ao remover meta", error: error.message });
  }
};
