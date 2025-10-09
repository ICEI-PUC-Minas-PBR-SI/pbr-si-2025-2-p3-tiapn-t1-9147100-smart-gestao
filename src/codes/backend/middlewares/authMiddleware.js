// ===========================================
// Arquivo: middlewares/authMiddleware.js
// Função: Validar JWT e popular req.user com informações essenciais
// Uso: aplicar em rotas protegidas que exigem autenticação
// ===========================================

import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * authMiddleware
 * - verifica se existe header Authorization com Bearer token
 * - valida o token JWT e busca o usuário no banco
 * - popula req.user com: { userId, companyId, role, email, uuid }
 * - em caso de erro, retorna 401
 */
export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token ausente ou formato inválido" });
    }

    const token = authHeader.split(" ")[1];

    // valida o token JWT
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Token inválido ou expirado" });
    }

    // Busca o usuário no banco para confirmar existência e status
    const user = await User.findById(payload.userId).lean();
    if (!user) return res.status(401).json({ message: "Usuário não encontrado" });
    if (!user.active && user.active !== undefined) return res.status(403).json({ message: "Usuário inativo" });

    // Popula req.user para uso pelos controllers/middlewares subsequentes
    req.user = {
      userId: String(user._id),
      companyId: user.companyId ? String(user.companyId) : null,
      role: user.role,
      email: user.email,
      uuid: user.uuid || null,
    };

    return next();
  } catch (error) {
    console.error("Erro em authMiddleware:", error);
    return res.status(500).json({ message: "Erro no middleware de autenticação" });
  }
}
