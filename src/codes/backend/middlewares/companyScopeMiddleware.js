// middlewares/companyScopeMiddleware.js
// Middleware que garante que as consultas sejam restritas à empresa do usuário autenticado

export function companyScopeMiddleware(model) {
  return async (req, res, next) => {
    try {
      const empresaId = req.user?.empresaId; // obtém empresa do token

      if (!empresaId) {
        return res.status(403).json({ message: "Acesso negado: empresa não identificada" });
      }

      // Define filtro de empresa para uso nos controllers
      req.companyFilter = { empresaId };
      req.companyScopedModel = model;

      next();
    } catch (err) {
      console.error("Erro no filtro de empresa:", err);
      res.status(500).json({ message: "Erro no escopo de empresa" });
    }
  };
}
