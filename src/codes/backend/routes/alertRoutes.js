// routes/alertRoutes.js
// Rotas para gerenciamento de alertas

import express from "express";
import {
  getAllAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  markAlertAsRead,
  deleteAlert
} from "../controllers/alertController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { companyScopeMiddleware } from "../middlewares/companyScopeMiddleware.js";
import { auditMiddleware } from "../middlewares/auditMiddleware.js";

const router = express.Router();

// Listar alertas
router.get("/", authMiddleware, companyScopeMiddleware, getAllAlerts);

// Obter alerta por id
router.get("/:id", authMiddleware, companyScopeMiddleware, getAlertById);

// Criar alerta
router.post("/", authMiddleware, auditMiddleware("CREATE_ALERT"), createAlert);

// Atualizar alerta
router.put("/:id", authMiddleware, auditMiddleware("UPDATE_ALERT"), updateAlert);

// Marcar como lido
router.put("/:id/read", authMiddleware, auditMiddleware("READ_ALERT"), markAlertAsRead);

// Remover alerta
router.delete("/:id", authMiddleware, auditMiddleware("DELETE_ALERT"), deleteAlert);

export default router;
