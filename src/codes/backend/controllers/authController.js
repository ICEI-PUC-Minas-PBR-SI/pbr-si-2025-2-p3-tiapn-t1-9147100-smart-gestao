// =============================================
// 📄 controllers/authController.js
// 🔐 Controle de autenticação (login, logout, refresh token)
// =============================================

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// =============================================================
// 🧩 Função: loginUser
// =============================================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // 🔑 Compara senha digitada com o hash do banco
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    // 🎫 Gera token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🔁 Gera refresh token (opcional)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
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

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token: newToken });
  } catch (error) {
    console.error("Erro no refreshToken:", error);
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};
