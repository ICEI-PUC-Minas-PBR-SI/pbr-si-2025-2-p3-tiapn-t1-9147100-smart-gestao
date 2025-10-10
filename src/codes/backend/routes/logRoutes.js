// ===========================================
// Arquivo: routes/logRoutes.js
// Descrição: Acesso aos registros de logs de ações do sistema
// ===========================================

import express from "express";
import { getAllLogs, getLogsByUser } from "../controllers/logController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// 🔹 Listar todos os logs (ROOT ou ADMIN_COMPANY)
router.get("/", authMiddleware, roleMiddleware(["ROOT", "ADMIN_COMPANY"]), getAllLogs);

// 🔹 Listar logs filtrados por usuário
router.get("/user/:userId", authMiddleware, getLogsByUser);

export default router;
