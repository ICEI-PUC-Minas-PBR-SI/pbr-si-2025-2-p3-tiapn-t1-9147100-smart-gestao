// =============================================
// 📄 controllers/authController.js
// 🔐 Controle de autenticação (login, logout, refresh token)
// =============================================

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import User from "../models/User.js";

// =============================================================
// 🧩 Função: loginUser
// =============================================================
export const loginUser = async (req, res) => {
  try {
  const { email, password } = req.body;

    // 🔍 Verifica se o usuário existe e seleciona a senha explicitamente
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // 🔑 Compara senha digitada com o hash armazenado
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    // --- Token Fingerprinting ---
    // Cria uma "impressão digital" da sessão do usuário usando o IP e o User-Agent.
    // Isso amarra o token à sessão original, aumentando a segurança.
    const userAgent = req.headers['user-agent'] || '';
    const clientIp = req.ip;
    const fingerprint = crypto.createHash('sha256').update(userAgent + clientIp).digest('hex');

    // 🎫 Gera token JWT, incluindo o fingerprint no payload.
    const token = jwt.sign(
      { userId: user._id, role: user.role, fingerprint },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "30m" }
    );

    // 🔁 Gera refresh token, também com o fingerprint.
    const refreshToken = jwt.sign(
      { userId: user._id, fingerprint },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "7d" }
    );

    // ✅ Retorna sucesso
    return res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no loginUser:", error);
    return res.status(500).json({ message: "Erro interno ao realizar login." });
  }
};

// =============================================================
// 🚪 Função: logoutUser
// =============================================================
export const logoutUser = async (req, res) => {
  try {
    // Aqui você pode invalidar o token (em um cache, blacklist etc.)
    return res.status(200).json({ message: "Logout realizado com sucesso." });
  } catch (error) {
    console.error("Erro no logoutUser:", error);
    return res.status(500).json({ message: "Erro ao realizar logout." });
  }
};

// =============================================================
// ♻️ Função: refreshToken
// =============================================================
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token de atualização não fornecido." });
    }

    // Verifica e decodifica o refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // --- Validação do Token Fingerprint ---
    // Garante que o refresh token também está sendo usado pelo mesmo cliente.
    const userAgent = req.headers['user-agent'] || '';
    const clientIp = req.ip;
    const currentFingerprint = crypto.createHash('sha256').update(userAgent + clientIp).digest('hex');

    if (decoded.fingerprint !== currentFingerprint) {
      // Se a impressão digital não bate, a requisição é suspeita e é rejeitada.
      return res.status(401).json({ message: "Violação de segurança: tentativa de refresh de token de outra sessão." });
    }

    // Gera um novo token de acesso com a mesma impressão digital.
    const newToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role, fingerprint: currentFingerprint },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "30m" }
    );

    return res.status(200).json({ token: newToken });
  } catch (error) {
    console.error("Erro no refreshToken:", error);
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};

// =============================================================
// 🔑 Função: forgotPassword
// =============================================================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Encontra o usuário pelo e-mail fornecido.
    const user = await User.findOne({ email });

    // 2. Se o usuário não for encontrado, retorna uma mensagem genérica por segurança.
    // Isso evita que um atacante descubra quais e-mails estão cadastrados no sistema.
    if (!user) {
      return res.status(200).json({ message: 'Se um usuário com este e-mail existir, um link de recuperação será gerado.' });
    }

    // 3. Gera um token de redefinição aleatório e seguro.
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 4. Cria um hash do token para ser armazenado no banco de dados.
    // NUNCA armazene tokens de reset em texto plano.
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // 5. Define um tempo de expiração para o token (ex: 10 minutos).
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // --- SIMULAÇÃO DE ENVIO DE E-MAIL (Ideal para ambiente acadêmico) ---
    // 6. Em um projeto real, aqui seria o código para enviar um e-mail.
    // Para simplificar, vamos gerar o link e exibi-lo no console do servidor.
    const resetUrl = `http://localhost:3000/pages/reset-password.html?token=${resetToken}`;

    console.log('================================================================');
    console.log('🔑 LINK DE RECUPERAÇÃO DE SENHA (COPIE E COLE NO NAVEGADOR):');
    console.log(resetUrl);
    console.log('================================================================');

    return res.status(200).json({ message: 'Link de recuperação simulado no console do servidor.' });

  } catch (error) {
    console.error("Erro no forgotPassword:", error);
    // Limpa os campos de token em caso de erro para evitar estados inconsistentes.
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(500).json({ message: "Erro interno ao solicitar redefinição de senha." });
  }
};

// =============================================================
// 🔄 Função: resetPassword
// =============================================================
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // 1. Cria o hash do token recebido do frontend para procurar no banco.
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 2. Procura um usuário que tenha o token correspondente e que ainda não tenha expirado.
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // $gt (greater than)
    });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido ou expirado. Por favor, solicite um novo link.' });
    }

    // 3. Criptografa a nova senha.
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);

    // 4. Limpa os campos de recuperação de senha do usuário.
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    console.error("Erro no resetPassword:", error);
    return res.status(500).json({ message: "Erro interno ao redefinir a senha." });
  }
};
