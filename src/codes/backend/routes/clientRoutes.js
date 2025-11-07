// =================================================================================
// ARQUIVO: routes/clientRoutes.js
// DESCRIÇÃO: Define as rotas para as operações CRUD de Clientes e Fornecedores.
//            A segurança multi-tenant é garantida pelo uso combinado dos middlewares.
// =================================================================================

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

// Rota para listar todos os clientes e fornecedores da empresa do usuário autenticado.
// GET /api/clients
router.get("/", authMiddleware, companyScopeMiddleware, getAllClients);

// Rota para cadastrar um novo cliente ou fornecedor.
// POST /api/clients
router.post("/", authMiddleware, companyScopeMiddleware, auditMiddleware("CREATE_CLIENT"), createClient);

// Rota para atualizar um cliente ou fornecedor existente por ID.
// PUT /api/clients/:id
router.put("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("UPDATE_CLIENT"), updateClient);

// Rota para excluir um cliente ou fornecedor por ID.
// DELETE /api/clients/:id
router.delete("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("DELETE_CLIENT"), deleteClient);

export default router;
