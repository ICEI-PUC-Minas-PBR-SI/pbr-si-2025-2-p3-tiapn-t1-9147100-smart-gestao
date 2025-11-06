// ===========================================
// Arquivo: routes/companyRoutes.js
// Descrição: Gerencia os cadastros das empresas no sistema
// ===========================================

import express from "express";
import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deactivateCompany,
} from "../controllers/companyController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { auditMiddleware } from "../middlewares/auditMiddleware.js";

const router = express.Router();

// - Cadastrar nova empresa (acesso ROOT)
router.post("/", authMiddleware, roleMiddleware(["ROOT"]), auditMiddleware("CREATE_COMPANY"), createCompany);

// - Listar empresas cadastradas
router.get("/", authMiddleware, roleMiddleware(["ROOT"]), getCompanies); // Acesso apenas para ROOT

// - Buscar empresa pelo ID
router.get("/:id", authMiddleware, getCompanyById);

// - Atualizar dados da empresa
router.put("/:id", authMiddleware, roleMiddleware(["ROOT", "ADMIN_COMPANY"]), auditMiddleware("UPDATE_COMPANY"), updateCompany);

// - Desativar empresa
router.patch("/:id/deactivate", authMiddleware, roleMiddleware(["ROOT"]), auditMiddleware("DEACTIVATE_COMPANY"), deactivateCompany);

export default router;
