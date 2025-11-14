import Company from "../models/Company.js";
import { successResponse, errorResponse } from '../utils/responseHelper.js';

/**
 * @desc    Criar uma nova empresa.
 * @route   POST /api/companies
 * @access  Private (geralmente restrito a administradores do sistema)
 * @note    Verifica se já existe uma empresa com o mesmo CNPJ para evitar duplicatas.
 */
export const createCompany = async (req, res) => {
  try {
    const { name, cnpj, email, phone, address, plan } = req.body; // Padronizado para 'email'

    // Verifica se já existe uma empresa com o mesmo CNPJ
    const existingCompany = await Company.findOne({ cnpj });
    if (existingCompany) {
      return errorResponse(res, { status: 409, message: "CNPJ já cadastrado no sistema." });
    }

    // Cria a nova empresa com os dados fornecidos e define valores padrão.
    // O plano 'BASIC' é atribuído se nenhum plano for especificado.
    const newCompany = await Company.create({
      name,
      cnpj,
      email,
      phone,
      address,
      isActive: true,
      plan: plan || "BASIC", // Adicionado plan com default
    });

    // Retorna uma resposta de sucesso (201 Created) com os dados da nova empresa.
    return successResponse(res, { status: 201, message: "Empresa criada com sucesso.", data: newCompany });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro interno ao criar empresa.", errors: error });
  }
};

export const getCompanies = async (req, res) => {
  try {
    // Busca todos os documentos na coleção 'companies' sem nenhum filtro.
    const items = await Company.find();
    return successResponse(res, { data: items });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro interno ao buscar empresas.", errors: error });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id); // Busca pelo ID
    // Se nenhuma empresa for encontrada com o ID fornecido, retorna um erro 404.
    if (!company) {
      return errorResponse(res, { status: 404, message: "Empresa não encontrada" });
    }
    return successResponse(res, { data: company });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao buscar empresa", errors: error });
  }
};

export const updateCompany = async (req, res) => {
  try {
    // Encontra a empresa pelo ID e atualiza com os dados do req.body.
    // A opção { new: true } garante que o documento retornado seja a versão atualizada.
    const updated = await Company.findByIdAndUpdate(req.params.id, req.body, { // Atualiza pelo ID
      new: true,
    });

    if (!updated) {
      // Se a empresa não for encontrada para atualização, retorna 404.
      return errorResponse(res, { status: 404, message: "Empresa não encontrada" });
    }

    return successResponse(res, { message: "Empresa atualizada com sucesso.", data: updated });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao atualizar empresa", errors: error });
  }
};

export const deactivateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id); // Busca pelo ID
    // Se a empresa não for encontrada, retorna 404.
    if (!company) {
      return errorResponse(res, { status: 404, message: "Empresa não encontrada" });
    }

    // Altera o status da empresa para inativo e salva a alteração.
    company.isActive = false;
    await company.save();

    return successResponse(res, { message: "Empresa desativada com sucesso" });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao desativar empresa", errors: error });
  }
};
