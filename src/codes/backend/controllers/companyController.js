// ===========================================
// Arquivo: controllers/companyController.js
// Função: Gerenciar informações das empresas no sistema
// ===========================================

import Company from "../models/Company.js";
import { createLog } from "../utils/logger.js";

/**
 * Listar todas as empresas cadastradas.
 * Somente administradores do sistema podem executar esta ação.
 */
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar empresas", error });
  }
};

/**
 * Criar uma nova empresa (realizado pelos administradores do sistema)
 */
export const createCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();

    await createLog({
      userId: req.user.userId,
      companyId: company._id,
      action: "CREATE_COMPANY",
      description: `Empresa criada: ${company.name}`,
      route: req.originalUrl,
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar empresa", error });
  }
};

/**
 * Atualizar informações da empresa
 */
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await createLog({
      userId: req.user.userId,
      companyId: company._id,
      action: "UPDATE_COMPANY",
      description: `Empresa atualizada: ${company.name}`,
      route: req.originalUrl,
    });

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar empresa", error });
  }
};
