// =================================================================================
// ARQUIVO: middlewares/companyScopeMiddleware.js
// DESCRIÇÃO: Middleware de escopo de empresa para garantir o isolamento de dados (multi-tenant).
//            Este é um dos middlewares de segurança mais críticos do sistema.
// =================================================================================

import mongoose from 'mongoose';

// Mapeia prefixos de rota para os nomes dos modelos Mongoose correspondentes.
const getModelFromUrl = (url) => {
  const modelMap = {
    '/api/transactions': 'Transaction',
    '/api/clients': 'Client',
    '/api/goals': 'Goal',
  };
  const modelName = Object.keys(modelMap).find(key => url.startsWith(key));
  return modelName ? mongoose.model(modelMap[modelName]) : null;
};

/**
 * Garante que um usuário só possa acessar recursos que pertencem à sua própria empresa.
 * Pré-requisito: Deve ser executado DEPOIS do `authMiddleware`.
 *
 * Funcionalidades:
 * 1. Atua apenas em rotas que contêm um ID de recurso (ex: `/api/transactions/:id`).
 * 2. Busca o documento no banco e valida se o `companyId` do documento corresponde ao `companyId` do usuário.
 * 3. Se não corresponder, retorna um erro 404 para não vazar a informação de que o recurso existe.
 */
export const companyScopeMiddleware = async (req, res, next) => {
  try {
    // Otimização: Se a rota não tem um ID, não há nada a ser verificado aqui.
    if (!req.params.id) {
      return next();
    }

    // Prevenção de Erro: Valida se o ID é um ObjectId válido antes de consultar o banco.
    // Isso previne erros de "Cast to ObjectId failed" e torna a API mais robusta.
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Recurso não encontrado (ID inválido)." });
    }

    const model = getModelFromUrl(req.originalUrl);
    if (!model) return next();

    const doc = await model.findById(req.params.id).select('companyId').lean();

    // Se o documento não existe, o controller será responsável por retornar o 404.
    if (!doc) {
      return next();
    }

    // Ponto Crítico da Segurança: Compara o ID da empresa do documento com o ID da empresa do usuário logado.
    if (doc.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(404).json({ message: "Recurso não encontrado." }); // Oculta a existência do recurso.
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Erro no middleware de escopo da empresa.", error: error.message });
  }
};
