// ===========================================
// Arquivo: routes/userRoutes.js
// Descrição: Gerencia usuários de cada empresa
// ===========================================

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

// 🔹 Listar usuários da empresa logada
router.get("/", authMiddleware, companyScopeMiddleware, getAllUsers);

// 🔹 Criar novo usuário (somente ADMIN_COMPANY ou ROOT)
router.post("/", authMiddleware, roleMiddleware(["ROOT", "ADMIN_COMPANY"]), companyScopeMiddleware, auditMiddleware("CREATE_USER"), createUser);

// 🔹 Atualizar dados de um usuário
router.put("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("UPDATE_USER"), updateUser);

// 🔹 Excluir usuário (desativar)
router.delete("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("DELETE_USER"), deleteUser);

// 🔹 Consultar perfil do usuário logado
router.get("/profile/me", authMiddleware, getProfile);

export default router;
