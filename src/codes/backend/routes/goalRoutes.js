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

const router = express.Router();

// GET /api/goals - Lista todas as metas da empresa
router.get("/", authMiddleware, companyScopeMiddleware, getGoals);

// GET /api/goals/:id - Obtém uma meta específica por ID
router.get("/:id", authMiddleware, companyScopeMiddleware, getGoalById);

// POST /api/goals - Cria uma nova meta
router.post("/", authMiddleware, companyScopeMiddleware, createGoal);

// PUT /api/goals/:id - Atualiza uma meta existente
router.put("/:id", authMiddleware, companyScopeMiddleware, updateGoal);

// DELETE /api/goals/:id - Exclui uma meta
router.delete("/:id", authMiddleware, companyScopeMiddleware, deleteGoal);

export default router;
