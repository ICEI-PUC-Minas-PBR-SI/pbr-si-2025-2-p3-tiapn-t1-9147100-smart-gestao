// Controlador de autenticação: cadastro e login de usuários

import User from "../models/User.js";
import bcrypt from "bcryptjs"; // para criptografar senhas
import jwt from "jsonwebtoken"; // para gerar token de sessão

// Cadastro de usuário
export const register = async (req, res) => {
  try {
    const { name, email, password, clientId } = req.body;

    // Criptografa a senha antes de salvar
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed, clientId });

    await newUser.save();
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login de usuário
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se usuário existe
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    // Compara senha informada com a salva no banco
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Senha inválida" });

    // Gera token JWT
    const token = jwt.sign(
      { id: user._id, clientId: user.clientId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, clientId: user.clientId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
