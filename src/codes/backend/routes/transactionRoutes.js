// =================================================================================
// ARQUIVO: routes/transactionRoutes.js
// DESCRIÇÃO: Define as rotas para as operações CRUD de Transações Financeiras.
//            Estas são rotas essenciais e protegidas do sistema.
// =================================================================================

import express from "express";
import {
  createTransaction,
  getAllTransactions,
  updateTransaction,
  getTransactionById,
  deleteTransaction,
} from "../controllers/transactionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { companyScopeMiddleware } from "../middlewares/companyScopeMiddleware.js";
import { auditMiddleware } from "../middlewares/auditMiddleware.js";

const router = express.Router();

// Rota para listar todas as transações financeiras da empresa, com suporte a filtros.
// GET /api/transactions
router.get("/", authMiddleware, companyScopeMiddleware, getAllTransactions);

// Rota para obter uma transação específica por ID.
// GET /api/transactions/:id
router.get("/:id", authMiddleware, companyScopeMiddleware, getTransactionById);

// Rota para criar uma nova transação (receita ou despesa).
// POST /api/transactions
router.post("/", authMiddleware, companyScopeMiddleware, auditMiddleware("CREATE_TRANSACTION"), createTransaction);

// Rota para atualizar uma transação existente.
// PUT /api/transactions/:id
router.put("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("UPDATE_TRANSACTION"), updateTransaction);

// Rota para excluir uma transação.
// DELETE /api/transactions/:id
router.delete("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("DELETE_TRANSACTION"), deleteTransaction);

export default router;
