// =================================================================================
// ARQUIVO: routes/logRoutes.js
// DESCRIÇÃO: Define as rotas para consulta dos logs de auditoria do sistema.
//            O acesso é restrito a administradores.
// =================================================================================

import express from "express";
import { getAllLogs, getLogsByUser } from "../controllers/logController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Rota para listar todos os logs do sistema, com suporte a filtros.
// Acesso restrito a usuários com permissão 'ROOT' ou 'ADMIN_COMPANY'.
// GET /api/logs
router.get("/", authMiddleware, roleMiddleware(["ROOT", "ADMIN_COMPANY"]), getAllLogs);

// Rota para listar todos os logs de um usuário específico.
// GET /api/logs/user/:userId
router.get("/user/:userId", authMiddleware, roleMiddleware(["ROOT", "ADMIN_COMPANY"]), getLogsByUser);

export default router;
