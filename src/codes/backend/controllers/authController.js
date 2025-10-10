// controllers/authController.js
// Login / logout e geração de token JWT

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import SessionToken from "../models/SessionToken.js";
import { createLog } from "../utils/logger.js";

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Retorna: { token, user } (user sem passwordHash)
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email e password são obrigatórios" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Credenciais inválidas" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Credenciais inválidas" });

    // Gera token JWT
    const token = jwt.sign(
      { userId: String(user._id), companyId: String(user.companyId), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION || "1d" }
    );

    // Armazena session token (opcional; facilita logout)
    await SessionToken.create({
      userId: user._id,
      token,
      ip: req.ip || req.headers["x-forwarded-for"],
      userAgent: req.headers["user-agent"],
      expiresAt: new Date(Date.now() + (24 * 3600 * 1000)), // 1 dia (ajustar conforme TOKEN_EXPIRATION)
    });

    // Remove passwordHash do objeto retornado
    const userObj = user.toObject();
    delete userObj.passwordHash;

    await createLog({
      userId: user._id,
      companyId: user.companyId,
      action: "USER_LOGIN",
      description: `Login realizado por ${user.email}`,
      route: req.originalUrl,
      ip: req.ip,
    });

    return res.status(200).json({ token, user: userObj });
  } catch (error) {
    console.error("login:", error);
    return res.status(500).json({ message: "Erro no login", error: error.message });
  }
};

/**
 * POST /api/auth/logout
 * Remove sessão (token) do banco
 * Requer authMiddleware para popular req.user
 */
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "Token ausente" });

    await SessionToken.deleteOne({ token });

    await createLog({
      userId: req.user.userId,
      companyId: req.user.companyId,
      action: "USER_LOGOUT",
      description: "Logout realizado",
      route: req.originalUrl,
    });

    return res.status(200).json({ message: "Logout efetuado com sucesso" });
  } catch (error) {
    console.error("logout:", error);
    return res.status(500).json({ message: "Erro no logout", error: error.message });
  }
};
