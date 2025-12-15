// =================================================================================
// ARQUIVO: routes/companyRoutes.js
// DESCRIÇÃO: Define as rotas para o gerenciamento de Empresas.
//            O acesso a estas rotas é altamente restrito, geralmente a superusuários (ROOT).
// =================================================================================

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

// Rota para cadastrar uma nova empresa. Acesso restrito a usuários com permissão 'ROOT'.
// POST /api/companies
router.post("/", authMiddleware, roleMiddleware(["ROOT"]), auditMiddleware("CREATE_COMPANY"), createCompany);

// Rota para listar todas as empresas cadastradas no sistema. Acesso restrito a 'ROOT'.
// GET /api/companies
router.get("/", authMiddleware, roleMiddleware(["ROOT"]), getCompanies);

// Rota para buscar uma empresa específica por ID.
// Acesso permitido a qualquer usuário autenticado para buscar sua própria empresa, por exemplo.
// GET /api/companies/:id
router.get("/:id", authMiddleware, getCompanyById);

// Rota para atualizar os dados de uma empresa.
// Permite que um 'ADMIN_COMPANY' atualize sua própria empresa ou que um 'ROOT' atualize qualquer empresa.
// PUT /api/companies/:id
router.put("/:id", authMiddleware, roleMiddleware(["ROOT", "ADMIN_COMPANY"]), auditMiddleware("UPDATE_COMPANY"), updateCompany);

// Rota para desativar uma empresa (soft delete). Acesso restrito a 'ROOT'.
// PATCH /api/companies/:id/deactivate
router.patch("/:id/deactivate", authMiddleware, roleMiddleware(["ROOT"]), auditMiddleware("DEACTIVATE_COMPANY"), deactivateCompany);

export default router;
