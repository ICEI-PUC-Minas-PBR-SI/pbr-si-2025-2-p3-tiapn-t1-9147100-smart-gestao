// =================================================================================
// ARQUIVO: routes/authRoutes.js
// DESCRIÇÃO: Define as rotas relacionadas à autenticação, registro e gerenciamento
//            de sessão dos usuários.
// =================================================================================

import express from "express";
import { registerUser, loginUser, logoutUser, refreshToken, deleteCurrentUser } from '../controllers/authController.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { auditMiddleware } from "../middlewares/auditMiddleware.js";

const router = express.Router();

// Rota pública para registrar um novo usuário e sua respectiva empresa.
// POST /api/auth/register
router.post('/register', auditMiddleware('REGISTER_COMPANY_USER'), registerUser);

// Rota pública para autenticar um usuário e obter os tokens de acesso e de atualização.
// POST /api/auth/login
router.post("/login", auditMiddleware("LOGIN_USER"), loginUser);

// Rota para deslogar um usuário, invalidando o Refresh Token no servidor.
// Esta rota é pública, mas a lógica no controller só funciona se um refreshToken válido for enviado.
// POST /api/auth/logout
router.post("/logout", authMiddleware, auditMiddleware("LOGOUT_USER"), logoutUser);

// Rota para renovar um Access Token expirado usando um Refresh Token válido.
// (Atualmente um placeholder).
// POST /api/auth/refresh
router.post("/refresh", authMiddleware, refreshToken);

// Rota protegida para excluir um usuário específico por ID.
// Esta rota é destrutiva e foi implementada principalmente para facilitar a limpeza durante os testes.
// DELETE /api/auth/users/:id
router.delete('/users/:id', authMiddleware, auditMiddleware('DELETE_USER_BY_ID'), deleteCurrentUser);

export default router;
