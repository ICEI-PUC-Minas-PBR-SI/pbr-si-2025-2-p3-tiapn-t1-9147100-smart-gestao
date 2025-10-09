// ===========================================
// Arquivo: middlewares/roleMiddleware.js
// Função: Verificar se o usuário possui um dos papéis (roles) permitidos
// Uso: roleMiddleware(['ADMIN_COMPANY', 'ROOT'])
// ===========================================

/**
 * roleMiddleware(allowedRoles)
 * - allowedRoles: array de strings com roles permitidos
 * - retorna middleware que verifica req.user.role
 */
export function roleMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;
      if (!userRole) return res.status(403).json({ message: "Role do usuário não encontrado" });

      // se permitted contém role do usuário, segue; caso contrário, 403
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
