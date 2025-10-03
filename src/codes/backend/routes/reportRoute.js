// Rotas de relatórios financeiros

import express from "express";
import { generateReport } from "../controllers/reportController.js";

const router = express.Router();

// Gerar relatório de um cliente (com período opcional)
router.get("/:clientId", generateReport);

export default router;
