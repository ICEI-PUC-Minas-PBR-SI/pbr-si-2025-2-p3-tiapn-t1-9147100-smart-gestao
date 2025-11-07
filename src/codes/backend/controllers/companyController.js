// =================================================================================
// ARQUIVO: controllers/companyController.js
// DESCRIÇÃO: Contém a lógica de negócio para manipular as requisições HTTP
//            relacionadas à entidade 'Company'. Cada função exportada corresponde
//            a uma operação CRUD (Create, Read, Update, Delete) e é projetada
//            para ser usada como um manipulador de rota no Express.
// =================================================================================

import Company from "../models/Company.js";

/**
 * Cria uma nova empresa no banco de dados.
 * Extrai os dados da empresa do corpo da requisição (req.body).
 * Verifica se já existe uma empresa com o mesmo CNPJ para evitar duplicatas.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const createCompany = async (req, res) => {
  try {
    const { name, cnpj, email, phone, address, plan } = req.body; // Padronizado para 'email'

    // Verifica se já existe uma empresa com o mesmo CNPJ
    const existingCompany = await Company.findOne({ cnpj });
    if (existingCompany) {
      return res.status(400).json({ message: "CNPJ já cadastrado no sistema." });
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
 * Lista todas as empresas cadastradas no sistema.
 * Esta é uma operação geralmente restrita a administradores.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getCompanies = async (req, res) => {
  try {
    // Busca todos os documentos na coleção 'companies' sem nenhum filtro.
    const companies = await Company.find(); // Já busca todas as empresas
    return res.status(200).json(companies);
  } catch (error) {
    console.error("Erro ao listar empresas:", error);
    return res.status(500).json({ message: "Erro interno ao buscar empresas." });
  }
};

/**
 * Busca uma única empresa pelo seu ID.
 * O ID é extraído dos parâmetros da URL da requisição (req.params.id).
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id); // Busca pelo ID
    // Se nenhuma empresa for encontrada com o ID fornecido, retorna um erro 404.
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
 * Atualiza os dados de uma empresa existente com base no seu ID.
 * Os novos dados são fornecidos no corpo da requisição (req.body).
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const updateCompany = async (req, res) => {
  try {
    // Encontra a empresa pelo ID e atualiza com os dados do req.body.
    // A opção { new: true } garante que o documento retornado seja a versão atualizada.
    const updated = await Company.findByIdAndUpdate(req.params.id, req.body, { // Atualiza pelo ID
      new: true,
    });

    if (!updated) {
      // Se a empresa não for encontrada para atualização, retorna 404.
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
 * Desativa uma empresa em vez de excluí-la permanentemente (soft delete).
 * Isso é feito alterando o campo `isActive` para `false`.
 * Essa abordagem preserva o histórico e a integridade dos dados relacionados.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const deactivateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id); // Busca pelo ID
    // Se a empresa não for encontrada, retorna 404.
    if (!company) {
      return res.status(404).json({ message: "Empresa não encontrada." });
    }

    // Altera o status da empresa para inativo e salva a alteração.
    company.isActive = false;
    await company.save();

    return res.status(200).json({ message: "Empresa desativada com sucesso." });
  } catch (error) {
    console.error("Erro ao desativar empresa:", error);
    return res.status(500).json({ message: "Erro interno ao desativar empresa." });
  }
};
