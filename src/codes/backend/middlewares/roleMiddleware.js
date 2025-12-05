// =================================================================================
// ARQUIVO: middlewares/roleMiddleware.js
// DESCRIÇÃO: Middleware de autorização baseado em papéis (roles/permissões).
//            Ele utiliza uma função de ordem superior para criar um middleware
//            configurável que verifica se o usuário autenticado possui uma das
//            permissões necessárias para acessar uma determinada rota.
// =================================================================================

/**
 * Cria um middleware que restringe o acesso a uma rota com base nas permissões do usuário.
 * @param {string[]} allowedRoles - Um array com os nomes das permissões autorizadas (ex: ['ADMIN_COMPANY', 'ROOT']).
 * @returns {function} Um middleware Express pronto para ser usado em uma rota.
 */
export function roleMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    try {
      // Pré-requisito: O `authMiddleware` deve ter sido executado antes,
      // populando `req.user.role` com o objeto de permissão completo.
      const userRoleName = req.user?.role?.name;
      if (!userRoleName) {
        // Este erro indica um problema de configuração, pois o `authMiddleware` deveria ter falhado antes.
        return res.status(500).json({ message: "Permissão do usuário não identificada na requisição." });
      }

      // Verifica se a permissão do usuário está na lista de permissões autorizadas para esta rota.
      if (!allowedRoles.includes(userRoleName)) {
        // Se a permissão do usuário não estiver na lista, o acesso é negado.
        return res.status(403).json({ message: "Acesso negado. Você não tem permissão para executar esta ação." });
      }

      // Se o usuário tem a permissão necessária, permite que a requisição continue.
      return next();
    } catch (error) {
      console.error("Erro em roleMiddleware:", error);
      return res.status(500).json({ message: "Erro no middleware de autorização" });
    }
  };
}
