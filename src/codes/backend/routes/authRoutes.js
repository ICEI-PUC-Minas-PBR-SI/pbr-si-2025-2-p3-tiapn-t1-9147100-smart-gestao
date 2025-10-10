// ===========================================
// Arquivo: routes/authRoutes.js
// Descrição: Rotas de autenticação — login, logout, renovação de token
// ===========================================

import express from "express";
import { loginUser, logoutUser, refreshToken } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { auditMiddleware } from "../middlewares/auditMiddleware.js";

const router = express.Router();

// 🔹 Login do usuário — retorna token JWT
router.post("/login", auditMiddleware("LOGIN_USER"), loginUser);

// 🔹 Logout — invalida o token atual
router.post("/logout", authMiddleware, auditMiddleware("LOGOUT_USER"), logoutUser);

// 🔹 Renovar token (caso esteja perto de expirar)
router.post("/refresh", authMiddleware, refreshToken);

export default router;
