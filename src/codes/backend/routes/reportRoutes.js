import express from "express";
import { getCompanyReport } from "../controllers/reportController.js";
import { companyScopeMiddleware } from "../middlewares/companyScopeMiddleware.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// Rota para gerar relatório financeiro da empresa logada
router.get("/", companyScopeMiddleware(Transaction), getCompanyReport);

export default router;
