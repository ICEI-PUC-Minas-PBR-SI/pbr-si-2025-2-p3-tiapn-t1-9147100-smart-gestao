// =================================================================================
// ARQUIVO: routes/metaRoutes.js
// DESCRIÇÃO: Define as rotas para as operações CRUD de Metas Financeiras.
//            Todas as rotas são protegidas e com escopo por empresa.
// =================================================================================

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

// Rota para listar todas as metas financeiras da empresa do usuário.
// GET /api/meta
router.get("/", authMiddleware, companyScopeMiddleware, getAllMetas);

// Rota para obter uma meta financeira específica por ID.
// GET /api/meta/:id
router.get("/:id", authMiddleware, companyScopeMiddleware, getMetaById);

// Rota para criar uma nova meta financeira.
// POST /api/meta
router.post("/", authMiddleware, companyScopeMiddleware, auditMiddleware("CREATE_META"), createMeta);

// Rota para atualizar uma meta financeira existente.
// PUT /api/meta/:id
router.put("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("UPDATE_META"), updateMeta);

// Rota para excluir uma meta financeira.
// DELETE /api/meta/:id
router.delete("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("DELETE_META"), deleteMeta);

export default router;
