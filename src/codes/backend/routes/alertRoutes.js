// =================================================================================
// ARQUIVO: routes/alertRoutes.js
// DESCRIÇÃO: Define as rotas para o gerenciamento de alertas (Alerts).
//            Todas as rotas são protegidas e garantem que um usuário só possa
//            interagir com os alertas de sua própria empresa.
// =================================================================================

import express from "express";
import {
  getAllAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  markAlertAsRead,
  deleteAlert,
} from "../controllers/alertController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { companyScopeMiddleware } from "../middlewares/companyScopeMiddleware.js";
import { auditMiddleware } from "../middlewares/auditMiddleware.js";

const router = express.Router();

// Rota para listar todos os alertas da empresa do usuário autenticado.
// GET /api/alerts
router.get("/", authMiddleware, companyScopeMiddleware, getAllAlerts);

// Rota para obter um alerta específico por ID.
// O `companyScopeMiddleware` garante que o usuário só possa acessar alertas de sua empresa.
// GET /api/alerts/:id
router.get("/:id", authMiddleware, companyScopeMiddleware, getAlertById);

// Rota para criar um novo alerta.
// POST /api/alerts
router.post("/", authMiddleware, companyScopeMiddleware, auditMiddleware("CREATE_ALERT"), createAlert);

// Rota para atualizar um alerta existente.
// PUT /api/alerts/:id
router.put("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("UPDATE_ALERT"), updateAlert);

// Rota para marcar um alerta como lido.
// PUT /api/alerts/:id/read
router.put("/:id/read", authMiddleware, companyScopeMiddleware, auditMiddleware("READ_ALERT"), markAlertAsRead);

// Rota para excluir um alerta.
// DELETE /api/alerts/:id
router.delete("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("DELETE_ALERT"), deleteAlert);

export default router;
