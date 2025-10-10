// ===========================================
// controllers/companyController.js
// Função: CRUD e controle de empresas (Company)
// Observação: somente usuários ROOT (donos do sistema)
// podem criar, listar ou remover empresas.
// ===========================================

import Company from "../models/Company.js";
import { createLog } from "../utils/logger.js";

/**
 * GET /api/companies
 * Lista todas as empresas cadastradas (somente ROOT)
 */
export const getAllCompanies = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== "ROOT") {
      return res.status(403).json({ message: "Acesso negado. Apenas ROOT pode listar empresas." });
    }

    const companies = await Company.find().sort({ name: 1 });
    return res.status(200).json(companies);
  } catch (error) {
    console.error("Erro em getAllCompanies:", error);
    return res.status(500).json({ message: "Erro ao listar empresas", error: error.message });
  }
};

/**
 * GET /api/companies/:id
 * Busca uma empresa específica pelo ID.
 */
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Empresa não encontrada" });
    return res.status(200).json(company);
  } catch (error) {
    console.error("Erro em getCompanyById:", error);
    return res.status(500).json({ message: "Erro ao buscar empresa", error: error.message });
  }
};

/**
 * POST /api/companies
 * Cria uma nova empresa (ROOT only).
 * Body esperado:
 * {
 *   "name": "TechSol",
 *   "cnpj": "12.345.678/0001-99",
 *   "email": "contato@techsol.com",
 *   "phone": "(31) 99999-0000"
 * }
 */
export const createCompany = async (req, res) => {
  try {
    if (req.user.role !== "ROOT") {
      return res.status(403).json({ message: "Apenas ROOT pode criar empresas" });
    }

    const { name, cnpj, email, phone } = req.body;

    // Verifica duplicidade de CNPJ
    const exists = await Company.findOne({ cnpj });
    if (exists) return res.status(400).json({ message: "Empresa com este CNPJ já cadastrada" });

    const company = await Company.create({
      name,
      cnpj,
      email,
      phone,
      createdBy: req.user.userId,
    });

    // Log de auditoria
    await createLog({
      userId: req.user.userId,
      companyId: company._id,
      action: "CREATE_COMPANY",
      description: `Empresa criada: ${name} (${cnpj})`,
      route: req.originalUrl,
    });

    return res.status(201).json(company);
  } catch (error) {
    console.error("Erro em createCompany:", error);
    return res.status(500).json({ message: "Erro ao criar empresa", error: error.message });
  }
};

/**
 * PUT /api/companies/:id
 * Atualiza os dados da empresa (ROOT ou ADMIN_COMPANY da própria empresa)
 */
export const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const requesterRole = req.user.role;

    // ROOT pode alterar qualquer empresa, ADMIN_COMPANY apenas a sua
    if (requesterRole !== "ROOT" && req.user.companyId !== companyId) {
      return res.status(403).json({ message: "Sem permissão para alterar esta empresa" });
    }

    const company = await Company.findByIdAndUpdate(companyId, req.body, { new: true });
    if (!company) return res.status(404).json({ message: "Empresa não encontrada" });

    await createLog({
      userId: req.user.userId,
      companyId: company._id,
      action: "UPDATE_COMPANY",
      description: `Empresa atualizada (${company.name})`,
      route: req.originalUrl,
    });

    return res.status(200).json(company);
  } catch (error) {
    console.error("Erro em updateCompany:", error);
    return res.status(500).json({ message: "Erro ao atualizar empresa", error: error.message });
  }
};

/**
 * DELETE /api/companies/:id
 * Remove empresa (somente ROOT)
 */
export const deleteCompany = async (req, res) => {
  try {
    if (req.user.role !== "ROOT") {
      return res.status(403).json({ message: "Apenas ROOT pode remover empresas" });
    }

    const removed = await Company.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Empresa não encontrada" });

    await createLog({
      userId: req.user.userId,
      companyId: removed._id,
      action: "DELETE_COMPANY",
      description: `Empresa removida: ${removed.name}`,
      route: req.originalUrl,
    });

    return res.status(200).json({ message: "Empresa removida com sucesso" });
  } catch (error) {
    console.error("Erro em deleteCompany:", error);
    return res.status(500).json({ message: "Erro ao remover empresa", error: error.message });
  }
};
