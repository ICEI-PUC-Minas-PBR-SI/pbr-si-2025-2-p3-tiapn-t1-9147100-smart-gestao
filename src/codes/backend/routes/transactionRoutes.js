// ===========================================
// Arquivo: routes/transactionRoutes.js
// Descrição: Gerencia as transações financeiras do sistema
// ===========================================

import express from "express";
import {
  createTransaction,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { companyScopeMiddleware } from "../middlewares/companyScopeMiddleware.js";
import { auditMiddleware } from "../middlewares/auditMiddleware.js";

const router = express.Router();

// 🔹 Listar todas as transações financeiras
router.get("/", authMiddleware, companyScopeMiddleware, getAllTransactions);

// 🔹 Criar nova transação
router.post("/", authMiddleware, companyScopeMiddleware, auditMiddleware("CREATE_TRANSACTION"), createTransaction);

// 🔹 Atualizar transação existente
router.put("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("UPDATE_TRANSACTION"), updateTransaction);

// 🔹 Excluir transação
router.delete("/:id", authMiddleware, companyScopeMiddleware, auditMiddleware("DELETE_TRANSACTION"), deleteTransaction);

export default router;
