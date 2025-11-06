import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Permission from '../models/Permission.js';
import Transaction from '../models/Transaction.js';
import { USER_COMPANY } from '../utils/constants.js';

// =============================================================
// - Função: registerUser
// =============================================================
export const registerUser = async (req, res) => {
  const { name, email, password, companyName, cnpj } = req.body;

  try {
    // 1. Validação - Verifica se o e-mail ou CNPJ já existem para evitar duplicidade.
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }
    if (await Company.findOne({ cnpj })) {
      return res.status(409).json({ message: 'CNPJ já cadastrado.' });
    }

    // 2. Permissão - Busca a permissão padrão de usuário ('USER_COMPANY') no banco.
    // Isso garante que novos usuários tenham o nível de acesso correto.
    const userPermission = await Permission.findOne({ name: USER_COMPANY });
    if (!userPermission) {
      return res.status(500).json({ message: 'Permissão de usuário padrão não encontrada.' });
    }

    // 3. Criação da Empresa: Salva a nova empresa no banco de dados.
    const newCompany = await new Company({ nome: companyName, cnpj }).save();

    // 4. Criptografia da Senha - Gera um "sal" e cria um hash seguro da senha.
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Criação do Usuário: Salva o novo usuário com a senha criptografada e os IDs da empresa e permissão.
    await new User({ name, email, passwordHash, companyId: newCompany._id, role: userPermission._id }).save();

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro no registerUser:', error);
    return res.status(500).json({ message: 'Erro interno ao cadastrar usuário.' });
  }
};

// =============================================================
// - Função: loginUser
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Busca do Usuário - Procura o usuário pelo e-mail e inclui o campo 'passwordHash' na resposta.
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) { // Se o usuário não for encontrado, retorna erro 401.
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // 2. Verificação da Senha - Compara a senha enviada com o hash armazenado no banco.
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // --- Geração dos Tokens ---
    // 3. Geração do Access Token: um token de curta duração para autenticar as próximas requisições.
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET, // Chave secreta do .env
      { expiresIn: '15m' } // Expira em 15 minutos
    );

    // 4. Geração do Refresh Token: um token de longa duração usado para obter um novo Access Token sem precisar de um novo login.
    const refreshTokenValue = jwt.sign(
     { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET, // Chave secreta diferente do .env
      { expiresIn: '7d' } // Expira em 7 dias
    );

    // Retorna os tokens e informações básicas do usuário
    return res.status(200).json({
      token: accessToken,
     refreshToken: refreshTokenValue,
     user: { name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Erro no loginUser:', error);
    return res.status(500).json({ message: 'Erro interno ao fazer login.' });
  }
};

// =============================================================
// - Função: logoutUser
// =============================================================
export const logoutUser = async (req, res) => {
  // Em uma implementação real, aqui você limparia o cookie do refresh token
  // e poderia adicionar o access token a uma "blacklist" para invalidá-lo imediatamente.
  res.status(200).json({ message: "Logout bem-sucedido." });
};

// =============================================================
// - Função: refreshToken
// =============================================================
export const refreshToken = async (req, res) => {
  // A lógica real aqui seria verificar o refresh token (geralmente de um cookie),
  // e se for válido, gerar um novo access token e um novo refresh token.
  // Por enquanto, é um placeholder.
  res.status(200).json({ message: "Token atualizado (placeholder)." });
};

// =============================================================
// - Função: deleteCurrentUser
// =============================================================
export const deleteCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.user.companyId;

    // Valida se o token contém as informações necessárias.
    if (!userId || !companyId) {
      return res.status(400).json({ message: 'Informações de usuário inválidas no token.' });
    }

    /*
     * COMENTÁRIO SOBRE LGPD E BOAS PRÁTICAS:
     * No mundo real, a exclusão de dados de usuário deve seguir regras de negócio e
     * leis como a LGPD. A abordagem ideal não seria uma exclusão permanente imediata (hard delete).
     *
     * O correto seria:
     * 1.  **Soft Delete:** Marcar o usuário e a empresa como "inativos" no banco de dados (ex: `user.active = false`).
     *     Isso impede o login, mas mantém os dados para fins fiscais ou legais.
     * 2.  **Quarentena:** Os dados permaneceriam em um estado de "quarentena" pelo período exigido por lei
     *     (ex: 5 anos para dados fiscais no Brasil).
     * 3.  **Exclusão Definitiva:** Apenas após o término do período legal, um processo automatizado (job)
     *     realizaria a exclusão permanente dos dados do banco.
     *
     * Para o propósito deste projeto e dos nossos testes, implementaremos a exclusão direta (hard delete).
    */

    // 1. Exclui todas as transações associadas à empresa.
    await Transaction.deleteMany({ companyId: companyId });
    // 2. Exclui o usuário.
    await User.findByIdAndDelete(userId);
    // 3. Exclui a empresa.
    await Company.findByIdAndDelete(companyId);

    res.status(200).json({ message: 'Usuário e todos os dados associados foram excluídos com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao tentar excluir o usuário.', error: error.message });
  }
};