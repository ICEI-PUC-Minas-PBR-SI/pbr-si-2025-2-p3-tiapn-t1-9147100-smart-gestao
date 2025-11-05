// controllers/userController.js
// CRUD e perfil de users

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createLog } from "../utils/logger.js";

/**
 * - POST /api/users
 * Cria usuário dentro da mesma company (admin cria para sua company)
 * Body: { name, email, password, role }
 */
export const createUser = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const creatorId = req.user.userId;
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) return res.status(400).json({ message: "name, email e password obrigatórios" });

    // evita duplicidade email por company
    const exists = await User.findOne({ companyId, email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: "Email já cadastrado nesta company" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      companyId,
      role: role || "USER",
    });

    await createLog({
      userId: creatorId,
      companyId,
      action: "CREATE_USER",
      description: `User criado: ${user.email}`,
      route: req.originalUrl,
    });

    const result = user.toObject();
    delete result.passwordHash;
    return res.status(201).json(result);
  } catch (error) {
    console.error("createUser:", error);
    return res.status(500).json({ message: "Erro ao criar user", error: error.message });
  }
};

/**
 * - GET /api/users
 * Lista usuários da company (sem passwordHash)
 */
export const getAllUsers = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const users = await User.find({ companyId }).select("-passwordHash").sort({ name: 1 });
    return res.status(200).json(users);
  } catch (error) {
    console.error("getAllUsers:", error);
    return res.status(500).json({ message: "Erro ao listar users", error: error.message });
  }
};

/**
 * - GET /api/users/profile/me
 * Retorna dados do perfil do usuário logado
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User não encontrado" });
    return res.status(200).json(user);
  } catch (error) {
    console.error("getProfile:", error);
    return res.status(500).json({ message: "Erro ao buscar perfil", error: error.message });
  }
};

/**
 * - PUT /api/users/:id
 * Atualiza user (não altera password aqui)
 */
export const updateUser = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const updated = await User.findOneAndUpdate({ _id: req.params.id, companyId }, { $set: req.body }, { new: true }).select("-passwordHash");
    if (!updated) return res.status(404).json({ message: "User não encontrado" });

    await createLog({
      userId: req.user.userId,
      companyId,
      action: "UPDATE_USER",
      description: `User atualizado: ${updated.email}`,
      route: req.originalUrl,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("updateUser:", error);
    return res.status(500).json({ message: "Erro ao atualizar user", error: error.message });
  }
};

/**
 * - DELETE /api/users/:id
 * Remove user (por simplicidade: deleção física; em produção, use flag active=false)
 */
export const deleteUser = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const removed = await User.findOneAndDelete({ _id: req.params.id, companyId });
    if (!removed) return res.status(404).json({ message: "User não encontrado" });

    await createLog({
      userId: req.user.userId,
      companyId,
      action: "DELETE_USER",
      description: `User removido: ${removed.email}`,
      route: req.originalUrl,
    });

    return res.status(200).json({ message: "User removido com sucesso" });
  } catch (error) {
    console.error("deleteUser:", error);
    return res.status(500).json({ message: "Erro ao remover user", error: error.message });
  }
};

/**
 * - POST /api/users/change-password
 * Permite usuário alterar sua senha atual (oldPassword, newPassword)
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: "oldPassword e newPassword obrigatórios" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User não encontrado" });

    const match = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Old password incorreta" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    await createLog({
      userId,
      companyId: req.user.companyId,
      action: "CHANGE_PASSWORD",
      description: "Senha alterada",
      route: req.originalUrl,
    });

    return res.status(200).json({ message: "Senha alterada com sucesso" });
  } catch (error) {
    console.error("changePassword:", error);
    return res.status(500).json({ message: "Erro ao alterar senha", error: error.message });
  }
};
