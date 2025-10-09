// ===========================================
// Arquivo: controllers/authController.js
// Função: Autenticação e controle de login/logout
// ===========================================

import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createLog } from "../config/logger.js";

/**
 * Login do usuário — valida credenciais e gera token JWT
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Usuário não encontrado." });

    // Verificação da senha criptografada
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Senha incorreta." });

    // Geração do token JWT
    const token = jwt.sign(
      { userId: user._id, companyId: user.companyId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION || "1d" }
    );

    await createLog({
      userId: user._id,
      companyId: user.companyId,
      action: "USER_LOGIN",
      description: `Login realizado com sucesso.`,
      route: req.originalUrl,
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erro no processo de login", error });
  }
};

/**
 * Logout — apenas gera log, sem invalidar o token (JWT é stateless)
 */
export const logout = async (req, res) => {
  await createLog({
    userId: req.user.userId,
    companyId: req.user.companyId,
    action: "USER_LOGOUT",
    description: "Usuário encerrou a sessão",
    route: req.originalUrl,
  });

  res.status(200).json({ message: "Logout registrado com sucesso." });
};
