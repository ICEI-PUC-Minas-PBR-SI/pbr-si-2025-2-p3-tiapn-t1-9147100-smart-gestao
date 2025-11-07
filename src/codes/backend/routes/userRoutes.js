// =================================================================================
// ARQUIVO: routes/userRoutes.js
// DESCRIÇÃO: Define as rotas para o gerenciamento de Usuários, incluindo
//            CRUD e consulta de perfil.
// =================================================================================

import express from "express";
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getProfile,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { auditMiddleware } from "../middlewares/auditMiddleware.js";
import { companyScopeMiddleware } from "../middlewares/companyScopeMiddleware.js";

const router = express.Router();

// Rota para listar todos os usuários da empresa do usuário autenticado.
// GET /api/users
router.get("/", authMiddleware, companyScopeMiddleware, getAllUsers);

// Rota para criar um novo usuário dentro da empresa.
// Acesso restrito a administradores ('ADMIN_COMPANY') ou superusuários ('ROOT').
// POST /api/users
router.post("/", authMiddleware, roleMiddleware(["ROOT", "ADMIN_COMPANY"]), companyScopeMiddleware, auditMiddleware("CREATE_USER"), createUser);

// Rota para atualizar os dados de um usuário específico por ID.
// PUT /api/users/:id
router.put("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("UPDATE_USER"), updateUser);

// Rota para excluir um usuário por ID.
// DELETE /api/users/:id
router.delete("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("DELETE_USER"), deleteUser);

// Rota especial para que o usuário autenticado consulte seu próprio perfil.
// GET /api/users/profile/me
router.get("/profile/me", authMiddleware, getProfile);

export default router;
