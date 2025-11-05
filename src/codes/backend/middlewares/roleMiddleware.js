// ===========================================
// Arquivo: middlewares/roleMiddleware.js
// Função: Verificar se o usuário possui um dos papéis (roles) permitidos
// Uso: roleMiddleware(['ADMIN_COMPANY', 'ROOT'])
// ===========================================

/**
 * - roleMiddleware(allowedRoles)
 * - allowedRoles: array de strings com roles permitidos
 * - retorna middleware que verifica req.user.role
 */
export function roleMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role; // Obtém a permissão do usuário, que foi adicionada pelo `authMiddleware`.
      if (!userRole) return res.status(403).json({ message: "Role do usuário não encontrado" });

      // Verifica se a permissão do usuário está na lista de permissões autorizadas para esta rota.
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Acesso negado: permissão insuficiente" });
      }

      return next();
    } catch (error) {
      console.error("Erro em roleMiddleware:", error);
      return res.status(500).json({ message: "Erro no middleware de autorização" });
    }
  };
}
