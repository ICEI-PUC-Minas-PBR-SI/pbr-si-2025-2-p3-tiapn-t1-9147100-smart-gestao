import express from "express";
import {
  createMeta,
  getAllMetas,
  updateMeta,
  getMetaById,
  deleteMeta,
} from "../controllers/metaController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { companyScopeMiddleware } from "../middlewares/companyScopeMiddleware.js";
import { auditMiddleware } from "../middlewares/auditMiddleware.js";

const router = express.Router();

// Rota para listar todas as metas financeiras da empresa do usuário. (Padronizado para 'goals')
// GET /api/goals
router.get("/", authMiddleware, companyScopeMiddleware, getAllMetas);

// Rota para obter uma meta financeira específica por ID. (Padronizado para 'goals')
// GET /api/goals/:id
router.get("/:id", authMiddleware, companyScopeMiddleware, getMetaById);

// Rota para criar uma nova meta financeira. (Padronizado para 'goals')
// POST /api/goals
router.post("/", authMiddleware, companyScopeMiddleware, auditMiddleware("CREATE_META"), createMeta);

// Rota para atualizar uma meta financeira existente. (Padronizado para 'goals')
// PUT /api/goals/:id
router.put("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("UPDATE_META"), updateMeta);

// Rota para excluir uma meta financeira. (Padronizado para 'goals')
// DELETE /api/goals/:id
router.delete("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("DELETE_META"), deleteMeta);

export default router;
