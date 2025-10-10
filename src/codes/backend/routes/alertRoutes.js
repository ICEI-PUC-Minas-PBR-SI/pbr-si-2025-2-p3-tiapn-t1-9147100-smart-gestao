// ===========================================
// Arquivo: routes/alertRoutes.js
// Descrição: Gerencia alertas financeiros (avisos, metas atingidas, etc.)
// ===========================================

import express from "express";
import {
  getAllAlerts,
  markAsRead,
  deleteAlert,
} from "../controllers/alertController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { companyScopeMiddleware } from "../middlewares/companyScopeMiddleware.js";
import { auditMiddleware } from "../middlewares/auditMiddleware.js";

const router = express.Router();

// 🔹 Listar todos os alertas da empresa do usuário logado
router.get("/", authMiddleware, companyScopeMiddleware, getAllAlerts);

// 🔹 Marcar um alerta como "lido"
router.put("/:id/read", authMiddleware, auditMiddleware("READ_ALERT"), markAsRead);

// 🔹 Remover um alerta (opcional)
router.delete("/:id", authMiddleware, auditMiddleware("DELETE_ALERT"), deleteAlert);

export default router;
