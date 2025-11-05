// ===========================================
// Arquivo: routes/clientRoutes.js
// Descrição: Gerencia clientes e fornecedores de cada empresa
// ===========================================

import express from "express";
import {
  createClient,
  getAllClients,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { companyScopeMiddleware } from "../middlewares/companyScopeMiddleware.js";
import { auditMiddleware } from "../middlewares/auditMiddleware.js";

const router = express.Router();

// - Listar todos os clientes/fornecedores da empresa
router.get("/", authMiddleware, companyScopeMiddleware, getAllClients);

// - Cadastrar um novo cliente/fornecedor
router.post("/", authMiddleware, companyScopeMiddleware, auditMiddleware("CREATE_CLIENT"), createClient);

// - Atualizar cliente/fornecedor
router.put("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("UPDATE_CLIENT"), updateClient);

// - Remover cliente/fornecedor
router.delete("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("DELETE_CLIENT"), deleteClient);

export default router;
