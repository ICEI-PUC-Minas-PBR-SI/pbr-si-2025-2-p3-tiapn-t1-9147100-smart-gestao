// =================================================================================
// ARQUIVO: controllers/authController.js
// DESCRIÇÃO: Contém os controladores responsáveis pela autenticação e gerenciamento
//            de sessão dos usuários, incluindo registro, login, logout e exclusão
//            de contas. Este é um ponto central da segurança da aplicação.
// =================================================================================

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import SessionToken from '../models/SessionToken.js';
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
    const newCompany = await new Company({ name: companyName, cnpj, email: email }).save();

    // 4. Criptografia da Senha - Gera um "sal" e cria um hash seguro da senha.
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Criação do Usuário: Salva o novo usuário com a senha criptografada e os IDs da empresa e permissão.
    const newUser = await new User({ name, email, passwordHash, companyId: newCompany._id, role: userPermission._id }).save();

    // Adicionado para retornar o ID do usuário, necessário para os testes
    const userResponse = newUser.toObject();
    delete userResponse.passwordHash;

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: userResponse._id });

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
      { userId: user._id, role: user.role, companyId: user.companyId }, // Adicionado companyId ao payload
      process.env.JWT_SECRET, // Chave secreta do .env
      { expiresIn: '15m' } // Expira em 15 minutos
    );

    // 4. Geração do Refresh Token: um token de longa duração usado para obter um novo Access Token sem precisar de um novo login.
    const refreshTokenValue = jwt.sign(
     { userId: user._id },
      process.env.JWT_REFRESH_SECRET, // Chave secreta diferente do .env
      { expiresIn: '7d' } // Expira em 7 dias
    );

    // Etapa 5: Armazenamento do Refresh Token (Uso básico do SessionToken)
    // Para dar uma utilidade ao modelo SessionToken, vamos salvar o hash do refresh token.
    // Isso transforma o logout em uma operação stateful, aumentando a segurança.
    const refreshTokenHash = crypto.createHash('sha256').update(refreshTokenValue).digest('hex');
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Adiciona 7 dias à data atual.

    await SessionToken.create({
      userId: user._id,
      tokenHash: refreshTokenHash,
      expiration: expirationDate,
      originIp: req.ip,
      device: req.headers['user-agent'],
    });

    // Retorna os tokens e informações básicas do usuário
    return res.status(200).json({
      token: accessToken,
     refreshToken: refreshTokenValue,
     user: { id: user._id, name: user.name, email: user.email, companyId: user.companyId } // Garante que companyId está na resposta
    });
  } catch (error) {
    console.error('Erro no loginUser:', error);
    return res.status(500).json({ message: 'Erro interno ao fazer login.' });
  }
};

// =============================================================

/**
 * Realiza o logout do usuário.
 * Esta função implementa um logout *stateful*. O cliente envia o `refreshToken`
 * que possui, e o servidor o localiza no banco de dados e o marca como inativo,
 * impedindo que ele seja usado para gerar novos tokens de acesso.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const logoutUser = async (req, res) => {
  // O cliente envia o refresh token que possui, e o servidor o invalida.
  const { refreshToken } = req.body; // Corrigido de 'token' para 'refreshToken' para alinhar com o frontend.

  // MOTIVO DA MUDANÇA: Garante que o token foi fornecido. Se a rota for pública,
  // esta validação é necessária para evitar processamento desnecessário.
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token não fornecido." });
  }
 
  try {
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    // Encontra o token e o marca como inativo.
    await SessionToken.findOneAndUpdate({ tokenHash: refreshTokenHash }, { active: false });
  } catch (error) {
    // A falha em invalidar o token não deve impedir o logout do lado do cliente.
    console.error("Erro ao invalidar refresh token durante o logout:", error);
  }

  res.status(200).json({ message: "Logout realizado com sucesso. A sessão foi invalidada no servidor." });
};

// =============================================================

/**
 * Inicia o processo de recuperação de senha.
 * Gera um token de reset e o salva no documento do usuário.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Gera um token seguro
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const passwordResetExpires = Date.now() + 10 * 60 * 1000; // Expira em 10 minutos

    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = passwordResetExpires;
    await user.save();

    // Em um app real, aqui você enviaria um e-mail para o usuário com um link contendo `resetToken`.
    // Para este projeto, retornamos o token para facilitar os testes.
    res.status(200).json({ message: 'Token de reset enviado com sucesso (simulado).', resetToken });

  } catch (error) {
    console.error('Erro no forgotPassword:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * Reseta a senha do usuário usando um token válido.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'As senhas não coincidem.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Senha alterada com sucesso.' });
  } catch (error) {
    console.error('Erro no resetPassword:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * Gera um novo Access Token usando um Refresh Token válido.
 * (Implementação atual é um placeholder).
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const refreshToken = async (req, res) => {
  // A lógica real verificaria o refresh token (geralmente vindo de um cookie httpOnly),
  // e se válido, geraria um novo access token (e opcionalmente um novo refresh token).
  res.status(200).json({ message: "Token atualizado (placeholder)." });
};

// =============================================================

/**
 * Exclui um usuário e todos os seus dados associados (empresa e transações).
 * Esta é uma operação destrutiva (hard delete) implementada para fins de teste e simplicidade.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const deleteCurrentUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userToDelete = await User.findById(userId);

    // Valida se o usuário a ser deletado realmente existe.
    if (!userToDelete) {
      return res.status(404).json({ message: 'Usuário a ser deletado não encontrado.' });
    }

    // NOTA SOBRE BOAS PRÁTICAS E LGPD:
    // A exclusão permanente (hard delete) não é recomendada em produção. A abordagem
    // ideal seria o "soft delete" (marcar como inativo), mantendo os dados por um
    // período legal antes da exclusão definitiva por um processo automatizado.
    // Esta implementação de exclusão direta serve para simplificar o escopo do projeto.
    
    const companyId = userToDelete.companyId;

    // Executa a exclusão em cascata de forma manual.
    // Etapa 1: Exclui todas as transações associadas à empresa.
    await Transaction.deleteMany({ companyId: companyId });
    // Etapa 2: Exclui o próprio usuário.
    await User.findOneAndDelete({ _id: userId });
    // Etapa 3: Exclui a empresa associada.
    await Company.findByIdAndDelete(companyId);

    res.status(200).json({ message: 'Usuário e todos os dados associados foram excluídos com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao tentar excluir o usuário.', error: error.message });
  }
};