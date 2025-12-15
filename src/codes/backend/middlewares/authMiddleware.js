// =================================================================================
// ARQUIVO: middlewares/authMiddleware.js
// DESCRIÇÃO: Middleware central de autenticação. Sua função é proteger rotas,
//            verificando a validade de um JSON Web Token (JWT) enviado no cabeçalho
//            da requisição. Se o token for válido, ele decodifica as informações
//            e anexa os dados do usuário ao objeto `req` para uso nos próximos
//            middlewares e controladores.
// =================================================================================

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Permission from "../models/Permission.js";

/**
 * Middleware para verificar a autenticação do usuário via JWT.
 * Este é o "guardião" de todas as rotas protegidas da API.
 */
export async function authMiddleware(req, res, next) {
  try {
    // 1. Extração do Token: Verifica se o cabeçalho 'Authorization' existe e se segue o padrão "Bearer [token]".
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Acesso negado. Token de autenticação não fornecido ou em formato inválido." });
    }
    const token = authHeader.split(" ")[1];

    // 2. Verificação do Token: Usa `jwt.verify` para checar a assinatura e a data de expiração do token.
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // Se a verificação falhar (assinatura inválida ou token expirado), o acesso é negado.
      return res.status(401).json({ message: "Token inválido ou expirado. Por favor, faça login novamente." });
    }

    // 3. Validação do Usuário no Banco: Após verificar o token, buscamos o usuário no banco.
    // Usamos .populate() para buscar o usuário e, em uma única query, trazer os dados da permissão.
    const user = await User.findById(payload.userId).populate('role').lean();

    if (!user) {
      return res.status(401).json({ message: "Usuário ou permissão associada a este token não foi encontrado." });
    }
    // A permissão agora está em user.role
    const permission = user.role;

    // Adiciona uma camada extra de segurança verificando se a conta está ativa.
    if (user.active === false) {
      return res.status(403).json({ message: "Acesso negado. Sua conta está inativa." });
    }

    // 4. Injeção dos Dados na Requisição: Anexa as informações essenciais do usuário ao objeto `req`.
    // A permissão (role) é anexada como um objeto completo, permitindo verificações como `req.user.role.name`.
    req.user = {
      userId: user._id, // Popula como ObjectId
      companyId: user.companyId, // Popula como ObjectId
      role: permission, // Anexa o documento de permissão completo
      email: user.email,
    };

    // 5. Continuação do Fluxo: Se tudo estiver correto, chama `next()` para passar a requisição para o próximo handler.
    return next();
  } catch (error) {
    console.error("Erro em authMiddleware:", error);
    return res.status(500).json({ message: "Erro interno no servidor durante a autenticação." });
  }
}
