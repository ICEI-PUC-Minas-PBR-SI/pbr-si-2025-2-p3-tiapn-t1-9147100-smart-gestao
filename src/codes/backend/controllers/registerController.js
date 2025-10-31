/**
 * @file Controller para o fluxo de registro público.
 * @description Cria uma nova Empresa e um Usuário administrador associado a ela.
 */

import mongoose from 'mongoose';
import Company from '../models/Company.js';
import User from '../models/User.js';

export const registerCompanyAndUser = async (req, res) => {
  // Inicia uma sessão para garantir a transação (tudo ou nada)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password, companyName, cnpj } = req.body;

    // Validações básicas de entrada
    if (!name || !email || !password || !companyName || !cnpj) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // 1. Cria a nova empresa dentro da transação
    const newCompany = new Company({
      name: companyName,
      cnpj: cnpj,
    });
    const savedCompany = await newCompany.save({ session });

    // 2. Cria o novo usuário administrador, associado à empresa recém-criada
    const newUser = new User({
      name,
      email,
      password, // A senha será criptografada pelo hook 'pre-save' do User model
      companyId: savedCompany._id,
      role: 'ADMIN_COMPANY', // O primeiro usuário é sempre o administrador
    });
    await newUser.save({ session });

    // 3. Se tudo deu certo, confirma a transação
    await session.commitTransaction();

    res.status(201).json({
      message: 'Empresa e usuário administrador criados com sucesso!',
    });

  } catch (error) {
    // Se qualquer passo falhar, desfaz todas as operações
    await session.abortTransaction();

    // Trata erros comuns como e-mail ou CNPJ duplicado
    if (error.code === 11000) {
      return res.status(409).json({ message: 'E-mail ou CNPJ já cadastrado.' });
    }
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno ao processar o registro.' });
  } finally {
    // Finaliza a sessão
    session.endSession();
  }
};