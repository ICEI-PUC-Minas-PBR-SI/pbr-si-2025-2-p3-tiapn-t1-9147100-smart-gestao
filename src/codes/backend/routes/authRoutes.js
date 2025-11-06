// ===========================================
// Arquivo: routes/authRoutes.js
// Descrição: Rotas de autenticação — registro, login, logout, renovação de token
// ===========================================

import express from "express";
import { registerUser, loginUser, logoutUser, refreshToken, deleteCurrentUser } from '../controllers/authController.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { auditMiddleware } from "../middlewares/auditMiddleware.js";

const router = express.Router();

// - Rota pública para criar uma nova empresa e seu primeiro usuário.
// O `auditMiddleware` registra a tentativa de cadastro.
router.post('/register', auditMiddleware('REGISTER_COMPANY_USER'), registerUser);

// - Rota pública para autenticar um usuário.
// Se as credenciais estiverem corretas, retorna um Access Token e um Refresh Token.
router.post("/login", auditMiddleware("LOGIN_USER"), loginUser);

// - Rota protegida para deslogar um usuário.
// O `authMiddleware` garante que apenas usuários autenticados possam chamar esta rota.
// Atualmente, é um placeholder para futuras lógicas de invalidação de sessão.
router.post("/logout", authMiddleware, auditMiddleware("LOGOUT_USER"), logoutUser);

// - Rota protegida para renovar um Access Token expirado.
// O `authMiddleware` valida o token (que pode estar expirado) para extrair dados.
// A lógica de validação do Refresh Token fica no controller.
router.post("/refresh", authMiddleware, refreshToken);

// - Rota protegida para excluir a conta do usuário logado e todos os seus dados.
// O `authMiddleware` garante que apenas o próprio usuário possa disparar esta ação.
router.delete('/users/me', authMiddleware, auditMiddleware('DELETE_CURRENT_USER'), deleteCurrentUser);

export default router;
