// =================================================================================
// ARQUIVO: controllers/userController.js
// DESCRIÇÃO: Controladores para o gerenciamento de usuários (Users), incluindo
//            operações CRUD, consulta de perfil e alteração de senha.
// =================================================================================

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createLog } from "../utils/logger.js";

/**
 * Cria um novo usuário dentro da mesma empresa do usuário autenticado.
 * Geralmente, esta ação é executada por um administrador da empresa.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const createUser = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const creatorId = req.user.userId; // userId já é ObjectId do authMiddleware
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) return res.status(400).json({ message: "name, email e password obrigatórios" });

    // Evita duplicidade de e-mail dentro da mesma empresa.
    const exists = await User.findOne({ companyId, email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: "Email já cadastrado nesta company" });

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
    return res.status(201).json(result);
  } catch (error) {
    console.error("createUser:", error);
    return res.status(500).json({ message: "Erro ao criar user", error: error.message });
  }
};

/**
 * Lista todos os usuários da empresa do usuário autenticado.
 * O hash da senha é explicitamente removido da resposta.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getAllUsers = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const users = await User.find({ companyId }).select("-passwordHash").sort({ name: 1 });
    return res.status(200).json(users);
  } catch (error) {
    console.error("getAllUsers:", error);
    return res.status(500).json({ message: "Erro ao listar users", error: error.message });
  }
};

/**
 * Retorna os dados de perfil do próprio usuário autenticado.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-passwordHash"); // userId já é ObjectId do authMiddleware
    if (!user) return res.status(404).json({ message: "User não encontrado" });
    return res.status(200).json(user);
  } catch (error) {
    console.error("getProfile:", error);
    return res.status(500).json({ message: "Erro ao buscar perfil", error: error.message });
  }
};

/**
 * Atualiza os dados de um usuário (exceto a senha).
 * Apenas usuários da mesma empresa podem ser atualizados.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const updateUser = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const updated = await User.findOneAndUpdate({ _id: req.params.id, companyId: companyId }, { $set: req.body }, { new: true }).select("-passwordHash");
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
 * Exclui um usuário (exclusão física).
 * Nota: Em produção, a melhor prática é a exclusão lógica (soft delete),
 * alterando um campo `active` para `false` para preservar o histórico.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const deleteUser = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const removed = await User.findOneAndDelete({ _id: req.params.id, companyId: companyId });
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
 * Permite que o usuário autenticado altere sua própria senha.
 * Requer a senha antiga para verificação e a nova senha.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId; // userId já é ObjectId do authMiddleware
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: "Senha antiga e nova senha são obrigatórias." });

    const user = await User.findById(userId).select("+passwordHash");
    if (!user) return res.status(404).json({ message: "User não encontrado" });

    const match = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Senha antiga incorreta." });

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
