// =================================================================================
// ARQUIVO: middlewares/companyScopeMiddleware.js
// DESCRIÇÃO: Middleware auxiliar para reforçar a arquitetura multi-tenant.
//            Sua função é extrair o `companyId` do usuário autenticado (injetado
//            pelo `authMiddleware`) e anexá-lo diretamente ao objeto `req`,
//            facilitando o acesso nos controladores.
//            Embora os controladores possam acessar `req.user.companyId` diretamente,
//            este middleware pode padronizar e simplificar a lógica de escopo.
// =================================================================================

/**
 * Middleware que adiciona o escopo da empresa à requisição.
 * Pré-requisito: Este middleware deve ser executado DEPOIS do `authMiddleware`.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 * @param {function} next - A função de callback para passar o controle adiante.
 */
export function companyScopeMiddleware(req, res, next) {
  try {
    // Garante que o `authMiddleware` foi executado e que o usuário possui uma empresa associada.
    if (!req.user || !req.user.companyId) {
      return res.status(403).json({ message: "Acesso negado: ID da empresa não identificado na sessão do usuário." });
    }

    // Anexa o ID da empresa e um objeto de filtro padrão ao `req` para
    // simplificar as consultas nos controladores.
    req.companyId = req.user.companyId;
    req.companyFilter = { companyId: req.companyId };

    // Passa para o próximo middleware ou controlador.
    return next();
  } catch (error) {
    console.error("Erro em companyScopeMiddleware:", error);
    return res.status(500).json({ message: "Erro no middleware de escopo de empresa" });
  }
}
