// controllers/companyController.js
// CRUD de Company (apenas ROOT cria/remover; ADMIN_COMPANY edita sua própria company)

import Company from "../models/Company.js";
import { createLog } from "../utils/logger.js";

/**
 * GET /api/companies
 * Lista empresas — apenas ROOT (owner do sistema)
 */
export const getAllCompanies = async (req, res) => {
  try {
    if (req.user.role !== "ROOT") return res.status(403).json({ message: "Acesso negado" });
    const companies = await Company.find().sort({ name: 1 });
    return res.status(200).json(companies);
  } catch (error) {
    console.error("getAllCompanies:", error);
    return res.status(500).json({ message: "Erro ao listar companies", error: error.message });
  }
};

/**
 * POST /api/companies
 * Cria nova company — apenas ROOT
 */
export const createCompany = async (req, res) => {
  try {
    if (req.user.role !== "ROOT") return res.status(403).json({ message: "Acesso negado" });

    const { name, cnpj, email, phone, address } = req.body;
    const exists = await Company.findOne({ cnpj });
    if (exists) return res.status(400).json({ message: "Company com este CNPJ já existe" });

    const company = await Company.create({ name, cnpj, email, phone, address });

    await createLog({
      userId: req.user.userId,
      companyId: company._id,
      action: "CREATE_COMPANY",
      description: `Company criada: ${company.name}`,
      route: req.originalUrl,
    });

    return res.status(201).json(company);
  } catch (error) {
    console.error("createCompany:", error);
    return res.status(500).json({ message: "Erro ao criar company", error: error.message });
  }
};

/**
 * PUT /api/companies/:id
 * Atualiza dados da company (ROOT ou ADMIN_COMPANY da própria company)
 */
export const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;

    // ROOT ou administrador da mesma company pode atualizar
    if (req.user.role !== "ROOT" && String(req.user.companyId) !== String(companyId)) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    const updated = await Company.findByIdAndUpdate(companyId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Company não encontrada" });

    await createLog({
      userId: req.user.userId,
      companyId: updated._id,
      action: "UPDATE_COMPANY",
      description: `Company atualizada: ${updated.name}`,
      route: req.originalUrl,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("updateCompany:", error);
    return res.status(500).json({ message: "Erro ao atualizar company", error: error.message });
  }
};

/**
 * DELETE /api/companies/:id
 * Remove company — apenas ROOT
 */
export const deleteCompany = async (req, res) => {
  try {
    if (req.user.role !== "ROOT") return res.status(403).json({ message: "Acesso negado" });
    const removed = await Company.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Company não encontrada" });

    await createLog({
      userId: req.user.userId,
      companyId: removed._id,
      action: "DELETE_COMPANY",
      description: `Company removida: ${removed.name}`,
      route: req.originalUrl,
    });

    return res.status(200).json({ message: "Company removida com sucesso" });
  } catch (error) {
    console.error("deleteCompany:", error);
    return res.status(500).json({ message: "Erro ao remover company", error: error.message });
  }
};
