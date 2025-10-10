// ===========================================
// controllers/metaController.js
// Função: CRUD de metas financeiras (Meta).
// Cada meta pertence a uma Company e foi criada por um User.
// ===========================================

import Meta from "../models/Meta.js";
import { createLog } from "../utils/logger.js";

/**
 * GET /api/meta
 * Lista todas as metas da company do usuário autenticado.
 */
export const getAllMetas = async (req, res) => {
  try {
    // companyId vem do authMiddleware (escopo)
    const companyId = req.user.companyId;

    const metas = await Meta.find({ companyId }).sort({ startDate: -1 });
    return res.status(200).json(metas);
  } catch (error) {
    console.error("Erro em getAllMetas:", error);
    return res.status(500).json({ message: "Erro ao listar metas", error: error.message });
  }
};

/**
 * POST /api/meta
 * Cria uma nova meta financeira para a company do usuário.
 * Corpo esperado:
 * {
 *   "type": "income" | "expense",
 *   "value": 1000,
 *   "startDate": "2025-10-01",
 *   "endDate": "2025-10-31",
 *   "focusCategory": "Alimentacao"
 * }
 */
export const createMeta = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const creatorId = req.user.userId;

    // Monta o documento com companyId vinculado
    const payload = {
      ...req.body,
      companyId,
    };

    const meta = await Meta.create(payload);

    // Grava log de auditoria (quem criou, quando e qual meta)
    await createLog({
      userId: creatorId,
      companyId,
      action: "CREATE_META",
      description: `Meta criada (type=${meta.type}, value=${meta.value})`,
      route: req.originalUrl,
    });

    return res.status(201).json(meta);
  } catch (error) {
    console.error("Erro em createMeta:", error);
    return res.status(500).json({ message: "Erro ao criar meta", error: error.message });
  }
};

/**
 * PUT /api/meta/:id
 * Atualiza uma meta existente (somente dentro da mesma company)
 */
export const updateMeta = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const updaterId = req.user.userId;
    const metaId = req.params.id;

    // Garantir que a atualização respeite companyId (segurança multiempresa)
    const meta = await Meta.findOneAndUpdate(
      { _id: metaId, companyId },
      { $set: req.body },
      { new: true }
    );

    if (!meta) return res.status(404).json({ message: "Meta não encontrada" });

    await createLog({
      userId: updaterId,
      companyId,
      action: "UPDATE_META",
      description: `Meta atualizada (${meta._id})`,
      route: req.originalUrl,
    });

    return res.status(200).json(meta);
  } catch (error) {
    console.error("Erro em updateMeta:", error);
    return res.status(500).json({ message: "Erro ao atualizar meta", error: error.message });
  }
};

/**
 * DELETE /api/meta/:id
 * Remove (ou desativa) uma meta. Aqui fazemos remoção física — para produção, prefira flag 'active'.
 */
export const deleteMeta = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const deleterId = req.user.userId;
    const metaId = req.params.id;

    const removed = await Meta.findOneAndDelete({ _id: metaId, companyId });
    if (!removed) return res.status(404).json({ message: "Meta não encontrada" });

    await createLog({
      userId: deleterId,
      companyId,
      action: "DELETE_META",
      description: `Meta removida (${removed._id})`,
      route: req.originalUrl,
    });

    return res.status(200).json({ message: "Meta removida com sucesso" });
  } catch (error) {
    console.error("Erro em deleteMeta:", error);
    return res.status(500).json({ message: "Erro ao remover meta", error: error.message });
  }
};
