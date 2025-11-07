// =================================================================================
// ARQUIVO: routes/permissionRoutes.js
// DESCRIÇÃO: Define as rotas para o gerenciamento de Permissões (Roles) do sistema.
//            Estas são rotas críticas de segurança e devem ser acessíveis
//            apenas por usuários com a permissão 'ROOT'.
// =================================================================================

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

// Rota para listar todas as permissões disponíveis no sistema.
// GET /api/permissions
router.get("/", authMiddleware, roleMiddleware(["ROOT"]), getAllPermissions);

// Rota para criar uma nova permissão.
// POST /api/permissions
router.post("/", authMiddleware, roleMiddleware(["ROOT"]), auditMiddleware("CREATE_PERMISSION"), createPermission);

// Rota para atualizar uma permissão existente.
// PUT /api/permissions/:id
router.put("/:id", authMiddleware, roleMiddleware(["ROOT"]), auditMiddleware("UPDATE_PERMISSION"), updatePermission);

// Rota para excluir uma permissão.
// DELETE /api/permissions/:id
router.delete("/:id", authMiddleware, roleMiddleware(["ROOT"]), auditMiddleware("DELETE_PERMISSION"), deletePermission);

export default router;
