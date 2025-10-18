// ======================================================
// 📂 controllers/companyController.js
// 🏢 Funções de controle para operações com empresas (Companies)
// ======================================================

import Company from "../models/Company.js";

/**
 * 🏗️ Cria uma nova empresa
 */
export const createCompany = async (req, res) => {
  try {
    const { name, cnpj, email, phone, address } = req.body;

    // Verifica se já existe uma empresa com o mesmo CNPJ
    const existingCompany = await Company.findOne({ cnpj });
    if (existingCompany) {
      return res.status(400).json({ message: "CNPJ já cadastrado no sistema." });
    }

    const newCompany = await Company.create({
      name,
      cnpj,
      email,
      phone,
      address,
      isActive: true,
    });

    return res.status(201).json({
      message: "Empresa criada com sucesso.",
      company: newCompany,
    });
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
    return res.status(500).json({ message: "Erro interno ao criar empresa." });
  }
};

/**
 * 📋 Lista todas as empresas
 */
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    return res.status(200).json(companies);
  } catch (error) {
    console.error("Erro ao listar empresas:", error);
    return res.status(500).json({ message: "Erro interno ao buscar empresas." });
  }
};

/**
 * 🔍 Busca uma empresa pelo ID
 */
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Empresa não encontrada." });
    }
    return res.status(200).json(company);
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    return res.status(500).json({ message: "Erro interno ao buscar empresa." });
  }
};

/**
 * ✏️ Atualiza dados de uma empresa
 */
export const updateCompany = async (req, res) => {
  try {
    const updated = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Empresa não encontrada." });
    }

    return res.status(200).json({
      message: "Empresa atualizada com sucesso.",
      company: updated,
    });
  } catch (error) {
    console.error("Erro ao atualizar empresa:", error);
    return res.status(500).json({ message: "Erro interno ao atualizar empresa." });
  }
};

/**
 * 🚫 Desativa uma empresa (soft delete)
 */
export const deactivateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Empresa não encontrada." });
    }

    company.isActive = false;
    await company.save();

    return res.status(200).json({ message: "Empresa desativada com sucesso." });
  } catch (error) {
    console.error("Erro ao desativar empresa:", error);
    return res.status(500).json({ message: "Erro interno ao desativar empresa." });
  }
};
