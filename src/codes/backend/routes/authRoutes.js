// =================================================================================
// ARQUIVO: routes/authRoutes.js
// DESCRIÇÃO: Define as rotas relacionadas à autenticação, registro e gerenciamento
//            de sessão dos usuários.
// =================================================================================

import express from "express";
import { registerUser, loginUser, logoutUser, refreshToken, deleteCurrentUser, forgotPassword, resetPassword } from '../controllers/authController.js';
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
// O authMiddleware foi removido para permitir que o logout funcione mesmo se o accessToken tiver expirado.
// POST /api/auth/logout
router.post("/logout", auditMiddleware("LOGOUT_USER"), logoutUser);

// Rota para renovar um Access Token expirado usando um Refresh Token válido.
// POST /api/auth/refresh
router.post("/refresh", refreshToken);

// Rota para solicitar a recuperação de senha
// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// Rota para efetivamente resetar a senha com um token válido
// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', resetPassword);

// Rota protegida para excluir um usuário específico por ID.
// Esta rota é destrutiva e foi implementada principalmente para facilitar a limpeza durante os testes.
// DELETE /api/auth/users/:id
router.delete('/users/:id', authMiddleware, auditMiddleware('DELETE_USER_BY_ID'), deleteCurrentUser);

export default router;
