import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Permission from "../models/Permission.js";
import { createLog } from "../utils/logger.js";
import mongoose from 'mongoose';
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { USER_COMPANY, ADMIN_COMPANY, ROOT } from "../utils/constants.js";

export const createUser = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const creatorId = req.user.userId; // userId já é ObjectId do authMiddleware
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) return errorResponse(res, { status: 400, message: "Nome, email e senha são obrigatórios." });

    // Evita duplicidade de e-mail dentro da mesma empresa.
    const exists = await User.findOne({ companyId, email: email.toLowerCase() });
    if (exists) return errorResponse(res, { status: 409, message: "Email já cadastrado nesta empresa." });

    // Lógica de segurança para atribuição de permissão (role)
    let userRoleId = role;
    const requesterRole = req.user.role.name; // A role do usuário que está fazendo a requisição

    // Se nenhuma role for especificada no payload, atribui USER_COMPANY por padrão.
    if (!userRoleId) { 
      const defaultUserRole = await Permission.findOne({ name: USER_COMPANY });
      if (!defaultUserRole) return errorResponse(res, { status: 500, message: "Permissão de usuário padrão (USER_COMPANY) não encontrada." });
      userRoleId = defaultUserRole._id;
    } else {
      // Se uma role foi especificada, verifica se o requisitante tem permissão para atribuí-la.
      const requestedRolePermission = await Permission.findById(userRoleId);
      if (!requestedRolePermission) return errorResponse(res, { status: 400, message: "Permissão solicitada inválida." });

      // Regra: ADMIN_COMPANY não pode atribuir ROOT. Apenas ROOT pode atribuir ROOT.
      if (requestedRolePermission.name === ROOT && requesterRole !== ROOT) { // Usando constantes
        return errorResponse(res, { status: 403, message: "Acesso negado. Você não tem permissão para atribuir a permissão ROOT." });
      }
      // Regra: ADMIN_COMPANY só pode atribuir ADMIN_COMPANY ou USER_COMPANY dentro da sua empresa.
      if (requesterRole === ADMIN_COMPANY && ![ADMIN_COMPANY, USER_COMPANY].includes(requestedRolePermission.name)) { // Usando constantes
        return errorResponse(res, { status: 403, message: `Acesso negado. Administradores de empresa só podem atribuir as permissões ${ADMIN_COMPANY} ou ${USER_COMPANY}.` });
      }
    }

    // Criptografa a senha antes de salvar no banco.
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      companyId,
      role: userRoleId,
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
    const updateData = { ...req.body };

    // --- Lógica de Segurança para Alteração de Role ---
    // Verifica se a requisição está tentando alterar a permissão do usuário.
    if (updateData.role) {
      // Busca as permissões do usuário que está fazendo a requisição e da que está sendo atribuída.
      const [requester, newRolePermission] = await Promise.all([
        User.findById(req.user.userId).populate('role'),
        Permission.findById(updateData.role)
      ]);

      const requesterRole = requester.role.name;

      // REGRA 1: Apenas ROOT ou ADMIN_COMPANY podem alterar permissões.
      if (requesterRole !== ROOT && requesterRole !== ADMIN_COMPANY) {
        // Se um usuário comum tentar alterar a permissão, retorna erro de acesso negado.
        return errorResponse(res, { status: 403, message: "Acesso negado. Você não tem permissão para alterar papéis de usuários." });
      }

      // REGRA 2: Um ADMIN_COMPANY não pode promover ninguém a ROOT.
      if (requesterRole === ADMIN_COMPANY && newRolePermission.name === ROOT) {
        return errorResponse(res, { status: 403, message: "Acesso negado. Administradores de empresa não podem atribuir a permissão ROOT." });
      }
    }

    // Procede com a atualização no banco de dados.
    const updated = await User.findOneAndUpdate(
      { _id: req.params.id, companyId: companyId },
      { $set: updateData },
      { new: true }
    ).select("-passwordHash");

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
