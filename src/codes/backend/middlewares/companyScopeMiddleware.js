// ===========================================
// Arquivo: middlewares/companyScopeMiddleware.js
// Função: Garantir que o escopo da requisição esteja atrelado à companyId do usuário
// Uso: proteger endpoints que retornam listas/dados para evitar vazamento entre empresas
// ===========================================

/**
 * - companyScopeMiddleware
 * - Define filtros prontos para consultas baseadas em companyId
 * - Popula req.companyId e req.companyFilter para uso nos controllers
 *
 * Exemplo de uso em rota:
 * router.get('/', authMiddleware, companyScopeMiddleware, controller.list);
 */
export function companyScopeMiddleware(req, res, next) {
  try {
    // Se não houver req.user (não autenticado), bloqueia
    if (!req.user || !req.user.companyId) {
      return res.status(403).json({ message: "Acesso negado: companyId não identificado" });
    }

    // Define valores úteis para controllers: companyId e um filtro básico
    req.companyId = req.user.companyId;
    req.companyFilter = { companyId: req.companyId };

    return next();
  } catch (error) {
    console.error("Erro em companyScopeMiddleware:", error);
    return res.status(500).json({ message: "Erro no middleware de escopo de empresa" });
  }
}
