// ===========================================
// Arquivo: controllers/userController.js
// Função: Controle de usuários — CRUD e permissões
// ===========================================

import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createLog } from "../utils/logger.js";

/**
 * Criar novo usuário dentro de uma empresa (feito pelo administrador)
 */
export const createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      ...req.body,
      companyId: req.user.companyId,
      password: hashedPassword,
    });
    await user.save();

    await createLog({
      userId: req.user.userId,
      companyId: req.user.companyId,
      action: "CREATE_USER",
      description: `Usuário criado: ${user.email}`,
      route: req.originalUrl,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário", error });
  }
};

/**
 * Listar usuários da empresa
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ companyId: req.user.companyId }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar usuários", error });
  }
};
