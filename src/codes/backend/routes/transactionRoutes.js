// Rotas de transações (receitas e despesas)

import express from "express";
import { createTransaction, getTransactions } from "../controllers/transactionController.js";

const router = express.Router();

// Criar transação
router.post("/", createTransaction);

// Listar transações de um cliente
router.get("/:clientId", getTransactions);

export default router;
