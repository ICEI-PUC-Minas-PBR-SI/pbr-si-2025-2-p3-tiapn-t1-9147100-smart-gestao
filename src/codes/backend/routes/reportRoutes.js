// =================================================================================
// ARQUIVO: routes/reportRoutes.js
// DESCRIÇÃO: Define as rotas para a geração de relatórios e dashboards financeiros.
//            Todos os relatórios são automaticamente filtrados pela empresa do
//            usuário autenticado.
// =================================================================================

import express from "express";
import { exportClientsPDF, exportInvoicePDF } from "../controllers/reportController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { exportTransactionsPDF } from "../controllers/reportController.js";

const router = express.Router();

// Rota para exportar um relatório de transações em formato PDF.
// GET /api/reports/export/transactions-pdf
router.get("/export/transactions-pdf", authMiddleware, exportTransactionsPDF);

// Rota para exportar um relatório de clientes em formato PDF.
// GET /api/reports/export/clients-pdf
router.get("/export/clients-pdf", authMiddleware, exportClientsPDF);

// Rota para exportar uma fatura de uma transação específica em PDF.
// GET /api/reports/export/invoice/:id
router.get("/export/invoice/:id", authMiddleware, exportInvoicePDF);

export default router;
