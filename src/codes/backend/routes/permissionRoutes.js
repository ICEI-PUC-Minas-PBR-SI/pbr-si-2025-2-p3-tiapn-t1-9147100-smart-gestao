// ===========================================
// Arquivo: routes/permissionRoutes.js
// Descrição: Rotas de administração de permissões (roles)
// ===========================================

import express from "express";
import {
  getAllPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permissionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { auditMiddleware } from "../middlewares/auditMiddleware.js";

const router = express.Router();

// - Listar todas as permissões
router.get("/", authMiddleware, roleMiddleware(["ROOT"]), getAllPermissions);

// - Criar nova permissão
router.post("/", authMiddleware, roleMiddleware(["ROOT"]), auditMiddleware("CREATE_PERMISSION"), createPermission);

// - Atualizar permissão
router.put("/:id", authMiddleware, roleMiddleware(["ROOT"]), auditMiddleware("UPDATE_PERMISSION"), updatePermission);

// - Excluir permissão
router.delete("/:id", authMiddleware, roleMiddleware(["ROOT"]), auditMiddleware("DELETE_PERMISSION"), deletePermission);

export default router;
