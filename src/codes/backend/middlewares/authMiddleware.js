// =================================================================================
// ARQUIVO: middlewares/authMiddleware.js
// DESCRIÇÃO: Middleware central de autenticação. Sua função é proteger rotas
//            verificando a validade de um JSON Web Token (JWT) enviado no
//            cabeçalho da requisição. Se o token for válido, ele decodifica
//            as informações e anexa os dados do usuário ao objeto `req`
//            para uso nos próximos middlewares e controladores.
// =================================================================================

import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware para verificar a autenticação do usuário via JWT.
 * Este é o "guardião" das rotas protegidas da API.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 * @param {function} next - A função de callback para passar o controle para o próximo middleware.
 */
export async function authMiddleware(req, res, next) {
  try {
    // Etapa 1: Extração do Token.
    // Verifica se o cabeçalho 'Authorization' existe e se segue o padrão "Bearer [token]".
    // Este é o método padrão para envio de tokens de autenticação.
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Acesso negado. Token de autenticação não fornecido ou em formato inválido." });
    }

    const token = authHeader.split(" ")[1];

    // Etapa 2: Verificação do Token.
    // Utiliza a biblioteca `jsonwebtoken` para verificar se o token é válido.
    // A função `jwt.verify` checa três coisas:
    // 1. A assinatura do token (garantindo que não foi modificado).
    // 2. A data de expiração do token.
    // 3. Se a chave secreta (`JWT_SECRET`) corresponde à usada na criação do token.
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Se a verificação falhar, o token é inválido ou expirado.
      return res.status(401).json({ message: "Token inválido ou expirado. Por favor, faça login novamente." });
    }

    // Etapa 3: Validação do Usuário.
    // Após verificar o token, buscamos o usuário no banco de dados usando o `userId` do payload.
    // Isso garante que o usuário não foi excluído ou desativado desde que o token foi gerado.
    // O método `.lean()` retorna um objeto JavaScript simples, o que otimiza a consulta.
    const user = await User.findById(payload.userId).lean();
    if (!user) {
      return res.status(401).json({ message: "Usuário associado a este token não foi encontrado." });
    }
    if (user.active === false) {
      return res.status(403).json({ message: "Acesso negado. Sua conta está inativa." });
    }

    // Etapa 4: Injeção dos Dados do Usuário na Requisição.
    // Anexa as informações essenciais do usuário ao objeto `req`.
    // Isso permite que os próximos middlewares e os controladores da rota acessem
    // facilmente quem é o usuário autenticado, qual sua empresa e seu nível de permissão.
    req.user = {
      userId: user._id, // Popula como ObjectId
      companyId: user.companyId, // Popula como ObjectId
      role: user.role,
      email: user.email,
      uuid: user.uuid || null,
    };

    // Etapa 5: Continuação do Fluxo.
    // Se tudo estiver correto, chama `next()` para passar a requisição para o próximo handler.
    return next();
  } catch (error) {
    console.error("Erro em authMiddleware:", error);
    return res.status(500).json({ message: "Erro interno no servidor durante a autenticação." });
  }
}
