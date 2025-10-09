// ===========================================
// Arquivo: controllers/metaController.js
// Função: Controle de metas financeiras (receitas e despesas)
// ===========================================

import Meta from "../models/Meta.js";
import { createLog } from "../utils/logger.js";

/**
 * Listar metas financeiras da empresa do usuário logado
 */
export const getMetas = async (req, res) => {
  try {
    const metas = await Meta.find({ companyId: req.user.companyId });
    res.status(200).json(metas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar metas", error });
  }
};

/**
 * Criar uma nova meta financeira
 */
export const createMeta = async (req, res) => {
  try {
    const meta = new Meta({
      ...req.body,
      companyId: req.user.companyId,
    });
    await meta.save();

    await createLog({
      userId: req.user.userId,
      companyId: req.user.companyId,
      action: "CREATE_META",
      description: `Meta criada (${meta.type}): ${meta.value}`,
      route: req.originalUrl,
    });

    res.status(201).json(meta);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar meta financeira", error });
  }
};

/**
 * Atualizar uma meta financeira existente
 */
export const updateMeta = async (req, res) => {
  try {
    const meta = await Meta.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await createLog({
      userId: req.user.userId,
      companyId: req.user.companyId,
      action: "UPDATE_META",
      description: `Meta atualizada: ${meta._id}`,
      route: req.originalUrl,
    });

    res.status(200).json(meta);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar meta", error });
  }
};
