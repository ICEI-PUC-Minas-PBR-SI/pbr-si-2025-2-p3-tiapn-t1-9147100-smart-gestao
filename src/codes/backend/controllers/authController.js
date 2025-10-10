// ===========================================
// Arquivo: controllers/AuthController.js
// Descrição: Controla autenticação e login de usuários
// ===========================================

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import SessionToken from "../models/SessionToken.js";
import { createLog } from "../utils/logger.js";

/**
 * Realiza o login e gera o token JWT para o usuário.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se o usuário existe
    const user = await User.findOne({ email }).populate("companyId");
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    // Compara a senha fornecida com o hash armazenado
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) return res.status(401).json({ message: "Senha incorreta" });

    // Cria token JWT
    const token = jwt.sign(
      { id: user._id, companyId: user.companyId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION || "1d" }
    );

    // Armazena o token na coleção de sessões
    await SessionToken.create({ userId: user._id, token });

    await createLog(req, "USER_LOGIN", `Usuário ${user.email} autenticado com sucesso.`);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Erro ao autenticar usuário", error: error.message });
  }
};

/**
 * Realiza logout e remove o token de sessão.
 */
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "Token ausente" });

    await SessionToken.deleteOne({ token });
    await createLog(req, "USER_LOGOUT", "Usuário realizou logout com sucesso.");
    res.status(200).json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao realizar logout", error: error.message });
  }
};
