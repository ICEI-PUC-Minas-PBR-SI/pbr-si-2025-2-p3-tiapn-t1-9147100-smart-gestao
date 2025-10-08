// middlewares/authMiddleware.js
// Verifica JWT presente no header Authorization: Bearer <token>
// Associa o usuário ao req.user

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token ausente" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload deve conter usuarioId
    const user = await User.findById(payload.id).lean();
    if (!user) return res.status(401).json({ message: "Usuário não encontrado" });
    req.user = user; // agora o controller pode usar req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
