// ===========================================
// Arquivo: routes/metaRoutes.js
// Descrição: Gerencia as metas financeiras definidas por empresa
// ===========================================

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

// - Listar metas financeiras
router.get("/", authMiddleware, companyScopeMiddleware, getAllMetas);

// - Obter uma meta específica por ID
router.get("/:id", authMiddleware, companyScopeMiddleware, getMetaById);

// - Criar nova meta
router.post("/", authMiddleware, companyScopeMiddleware, auditMiddleware("CREATE_META"), createMeta);

// - Atualizar meta existente
router.put("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("UPDATE_META"), updateMeta);

// - Excluir meta
router.delete("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("DELETE_META"), deleteMeta);

export default router;
