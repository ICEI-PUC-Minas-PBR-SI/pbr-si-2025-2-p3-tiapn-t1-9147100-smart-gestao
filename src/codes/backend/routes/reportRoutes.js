// =================================================================================
// ARQUIVO: routes/reportRoutes.js
// DESCRIÇÃO: Define as rotas para a geração de relatórios e dashboards financeiros.
//            Todos os relatórios são automaticamente filtrados pela empresa do
//            usuário autenticado.
// =================================================================================

import express from "express";
import { getFinancialSummary, getMonthlyReport, getAlertsReport } from "../controllers/reportController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { companyScopeMiddleware } from "../middlewares/companyScopeMiddleware.js";

const router = express.Router();

// Rota para obter um resumo financeiro geral (total de receitas, despesas e lucro).
// GET /api/reports/summary
router.get("/summary", authMiddleware, companyScopeMiddleware, getFinancialSummary);

// Rota para obter um relatório financeiro agrupado por mês.
// GET /api/reports/monthly
router.get("/monthly", authMiddleware, companyScopeMiddleware, getMonthlyReport);

// Rota para obter um relatório de todos os alertas gerados para a empresa.
// GET /api/reports/alerts
router.get("/alerts", authMiddleware, companyScopeMiddleware, getAlertsReport);

export default router;
