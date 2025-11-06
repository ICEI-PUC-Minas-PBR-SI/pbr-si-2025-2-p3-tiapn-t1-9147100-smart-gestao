// ===========================================
// Arquivo: middlewares/authMiddleware.js
// Função: Validar JWT e popular req.user com informações essenciais
// Uso: aplicar em rotas protegidas que exigem autenticação
// ===========================================

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from 'crypto';

/**
 * authMiddleware
 * - verifica se existe header Authorization com Bearer token
 * - valida o token JWT e busca o usuário no banco
 * - popula req.user com: { userId, companyId, role, email, uuid }
 * - em caso de erro, retorna 401
 */
export async function authMiddleware(req, res, next) {
  try {
    // 1. Verifica se o cabeçalho de autorização existe e segue o padrão "Bearer [token]".
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token ausente ou formato inválido" });
    }

    const token = authHeader.split(" ")[1];

    // 2. Valida a assinatura e a expiração do token JWT.
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Token inválido ou expirado" });
    }

    // // 3. (Opcional, mas recomendado) Validação do Token Fingerprint para segurança extra.
    // // Recalcula a impressão digital da requisição atual.
    // const userAgent = req.headers['user-agent'] || '';
    // const clientIp = req.ip; // req.ip might not be reliable in all environments (e.g., behind proxies)
    // const currentFingerprint = crypto.createHash('sha256').update(userAgent + clientIp).digest('hex');
    //
    // // Compara a impressão digital da requisição atual com a que foi gravada no token.
    // // Se não baterem, o token pode ter sido roubado.
    // if (payload.fingerprint !== currentFingerprint) {
    //   return res.status(401).json({ message: "Token inválido para esta sessão." });
    // }

    // 4. Busca o usuário no banco para confirmar que ele ainda existe e está ativo.
    const user = await User.findById(payload.userId).lean();
    if (!user) return res.status(401).json({ message: "Usuário não encontrado" });
    if (!user.active && user.active !== undefined) return res.status(403).json({ message: "Usuário inativo" });

    // 5. Anexa os dados essenciais do usuário ao objeto `req` para uso nos próximos middlewares e controllers.
    req.user = {
      userId: user._id, // Popula como ObjectId
      companyId: user.companyId, // Popula como ObjectId
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
