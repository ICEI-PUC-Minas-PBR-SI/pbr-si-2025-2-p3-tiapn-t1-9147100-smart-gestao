// ===========================================
// Arquivo: routes/reportRoutes.js
// Descrição: Geração de relatórios e dashboards financeiros
// ===========================================

import express from "express";
import { getFinancialSummary, getMonthlyReport, getAlertsReport } from "../controllers/reportController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { companyScopeMiddleware } from "../middlewares/companyScopeMiddleware.js";

const router = express.Router();

// 🔹 Resumo financeiro geral (receitas/despesas)
router.get("/summary", authMiddleware, companyScopeMiddleware, getFinancialSummary);

// 🔹 Relatório financeiro mensal
router.get("/monthly", authMiddleware, companyScopeMiddleware, getMonthlyReport);

// 🔹 Relatório de alertas (metas atingidas)
router.get("/alerts", authMiddleware, companyScopeMiddleware, getAlertsReport);

export default router;
