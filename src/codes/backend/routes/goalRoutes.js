// =================================================================================
// ARQUIVO: routes/goalRoutes.js
// DESCRIÇÃO: Define as rotas para as operações CRUD de Metas Financeiras.
//            Todas as rotas são protegidas e com escopo por empresa.
// =================================================================================

import express from "express";
import {
  createGoal,
  getGoals,
  updateGoal,
  getGoalById,
  deleteGoal,
} from "../controllers/goalController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { companyScopeMiddleware } from "../middlewares/companyScopeMiddleware.js";
import { auditMiddleware } from "../middlewares/auditMiddleware.js";

const router = express.Router();

// Rota para listar todas as metas financeiras da empresa do usuário.
// GET /api/goals
router.get("/", authMiddleware, getGoals);

// Rota para obter uma meta financeira específica por ID.
// O `companyScopeMiddleware` garante que o usuário só possa acessar metas de sua própria empresa.
// GET /api/goals/:id
router.get("/:id", authMiddleware, companyScopeMiddleware, getGoalById);

// Rota para criar uma nova meta financeira.
// POST /api/goals
router.post("/", authMiddleware, auditMiddleware("CREATE_GOAL"), createGoal);

// Rota para atualizar uma meta financeira existente.
// PUT /api/goals/:id
router.put("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("UPDATE_GOAL"), updateGoal);

// Rota para excluir uma meta financeira.
// DELETE /api/goals/:id
router.delete("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("DELETE_GOAL"), deleteGoal);

export default router;
