import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createLog } from "../utils/logger.js";
import mongoose from 'mongoose';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const createUser = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const creatorId = req.user.userId; // userId já é ObjectId do authMiddleware
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) return errorResponse(res, { status: 400, message: "Nome, email e senha são obrigatórios." });

    // Evita duplicidade de e-mail dentro da mesma empresa.
    const exists = await User.findOne({ companyId, email: email.toLowerCase() });
    if (exists) return errorResponse(res, { status: 409, message: "Email já cadastrado nesta empresa." });

    // Criptografa a senha antes de salvar no banco.
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      companyId,
      role: role || "USER",
    }); // role já é ObjectId

    // Registra a criação do usuário no log de auditoria.
    await createLog({
      userId: creatorId,
      companyId,
      action: "CREATE_USER",
      description: `User criado: ${user.email}`,
      route: req.originalUrl,
    });

    // Remove o hash da senha do objeto de resposta por segurança.
    const result = user.toObject();
    delete result.passwordHash;
    return successResponse(res, { status: 201, data: result });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao criar usuário.", errors: error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const items = await User.find({ companyId }).select("-passwordHash").sort({ name: 1 });
    return successResponse(res, { data: items });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao listar usuários.", errors: error });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-passwordHash"); // userId já é ObjectId do authMiddleware
    if (!user) return errorResponse(res, { status: 404, message: "Usuário não encontrado." });
    return successResponse(res, { data: user });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao buscar perfil.", errors: error });
  }
};

export const updateUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return errorResponse(res, { status: 404, message: "Usuário não encontrado." });

    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const updated = await User.findOneAndUpdate({ _id: req.params.id, companyId: companyId }, { $set: req.body }, { new: true }).select("-passwordHash");
    if (!updated) return errorResponse(res, { status: 404, message: "Usuário não encontrado." });

    await createLog({
      userId: req.user.userId,
      companyId,
      action: "UPDATE_USER",
      description: `User atualizado: ${updated.email}`,
      route: req.originalUrl,
    });

    return successResponse(res, { data: updated });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao atualizar usuário.", errors: error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return errorResponse(res, { status: 404, message: "Usuário não encontrado" });

    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const removed = await User.findOneAndDelete({ _id: req.params.id, companyId: companyId });
    if (!removed) return errorResponse(res, { status: 404, message: "Usuário não encontrado" });

    await createLog({
      userId: req.user.userId,
      companyId,
      action: "DELETE_USER",
      description: `User removido: ${removed.email}`,
      route: req.originalUrl,
    });

    return successResponse(res, { message: "Usuário removido com sucesso" });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao remover usuário.", errors: error });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId; // userId já é ObjectId do authMiddleware
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return errorResponse(res, { status: 400, message: "Senha antiga e nova senha são obrigatórias." });

    const user = await User.findById(userId).select("+passwordHash");
    if (!user) return errorResponse(res, { status: 404, message: "Usuário não encontrado" });

    const match = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!match) return errorResponse(res, { status: 401, message: "Senha antiga incorreta" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    await createLog({
      userId,
      companyId: req.user.companyId,
      action: "CHANGE_PASSWORD",
      description: "Senha alterada",
      route: req.originalUrl,
    });

    return successResponse(res, { message: "Senha alterada com sucesso" });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao alterar senha.", errors: error });
  }
};
