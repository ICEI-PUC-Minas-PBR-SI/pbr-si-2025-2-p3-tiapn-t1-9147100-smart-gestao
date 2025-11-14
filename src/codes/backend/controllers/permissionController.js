import Permission from "../models/Permission.js";
import { createLog } from "../utils/logger.js";
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const getAllPermissions = async (req, res) => {
  try {
    const items = await Permission.find().sort({ name: 1 }); // Busca todas as permissões
    return successResponse(res, { data: items });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao listar permissões.", errors: error });
  }
};

export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return errorResponse(res, { status: 400, message: "O campo 'name' é obrigatório." });

    // Garante que o nome da permissão seja único.
    const exists = await Permission.findOne({ name: name.toUpperCase() });
    if (exists) return errorResponse(res, { status: 409, message: "Uma permissão com este nome já existe." });

    const perm = await Permission.create({ name: name.toUpperCase(), description });

    await createLog({
      userId: req.user.userId,
      companyId: req.user.companyId,
      action: "CREATE_PERMISSION",
      description: `Permissão criada: ${perm.name}`,
      route: req.originalUrl,
    });

    return successResponse(res, { status: 201, data: perm });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao criar permissão.", errors: error });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const updated = await Permission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return errorResponse(res, { status: 404, message: "Permissão não encontrada." });

    await createLog({
      userId: req.user.userId,
      companyId: req.user.companyId,
      action: "UPDATE_PERMISSION",
      description: `Permissão atualizada: ${updated.name}`,
      route: req.originalUrl,
    });

    return successResponse(res, { data: updated });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao atualizar permissão.", errors: error });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const removed = await Permission.findByIdAndDelete(req.params.id);
    if (!removed) return errorResponse(res, { status: 404, message: "Permissão não encontrada." });

    await createLog({
      userId: req.user.userId,
      companyId: req.user.companyId,
      action: "DELETE_PERMISSION",
      description: `Permissão removida: ${removed.name}`,
      route: req.originalUrl,
    });

    return successResponse(res, { message: "Permissão removida com sucesso" });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao remover permissão.", errors: error });
  }
};
