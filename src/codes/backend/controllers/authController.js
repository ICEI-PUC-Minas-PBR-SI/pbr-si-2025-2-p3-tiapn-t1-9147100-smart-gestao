// =============================================
// 📄 controllers/authController.js
// 🔐 Controle de autenticação (login, logout, refresh token)
// =============================================

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import User from "../models/User.js";

// =============================================================
// 🧩 Função: loginUser
// =============================================================
export const loginUser = async (req, res) => {
  try {
  const { email, password } = req.body;

    // 🔍 Verifica se o usuário existe e seleciona a senha explicitamente
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // 🔑 Compara senha digitada com o hash armazenado
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    // --- Token Fingerprinting ---
    // Cria uma "impressão digital" da sessão do usuário usando o IP e o User-Agent.
    // Isso amarra o token à sessão original, aumentando a segurança.
    const userAgent = req.headers['user-agent'] || '';
    const clientIp = req.ip;
    const fingerprint = crypto.createHash('sha256').update(userAgent + clientIp).digest('hex');

    // 🎫 Gera token JWT, incluindo o fingerprint no payload.
    const token = jwt.sign(
      { userId: user._id, role: user.role, fingerprint },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "30m" }
    );

    // 🔁 Gera refresh token, também com o fingerprint.
    const refreshToken = jwt.sign(
      { userId: user._id, fingerprint },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "7d" }
    );

    // ✅ Retorna sucesso
    return res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no loginUser:", error);
    return res.status(500).json({ message: "Erro interno ao realizar login." });
  }
};

// =============================================================
// 🚪 Função: logoutUser
// =============================================================
export const logoutUser = async (req, res) => {
  try {
    // Aqui você pode invalidar o token (em um cache, blacklist etc.)
    return res.status(200).json({ message: "Logout realizado com sucesso." });
  } catch (error) {
    console.error("Erro no logoutUser:", error);
    return res.status(500).json({ message: "Erro ao realizar logout." });
  }
};

// =============================================================
// ♻️ Função: refreshToken
// =============================================================
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token de atualização não fornecido." });
    }

    // Verifica e decodifica o refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // --- Validação do Token Fingerprint ---
    // Garante que o refresh token também está sendo usado pelo mesmo cliente.
    const userAgent = req.headers['user-agent'] || '';
    const clientIp = req.ip;
    const currentFingerprint = crypto.createHash('sha256').update(userAgent + clientIp).digest('hex');

    if (decoded.fingerprint !== currentFingerprint) {
      // Se a impressão digital não bate, a requisição é suspeita e é rejeitada.
      return res.status(401).json({ message: "Violação de segurança: tentativa de refresh de token de outra sessão." });
    }

    // Gera um novo token de acesso com a mesma impressão digital.
    const newToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role, fingerprint: currentFingerprint },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "30m" }
    );

    return res.status(200).json({ token: newToken });
  } catch (error) {
    console.error("Erro no refreshToken:", error);
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};
