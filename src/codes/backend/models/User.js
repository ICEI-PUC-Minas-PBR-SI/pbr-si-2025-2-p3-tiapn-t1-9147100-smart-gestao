// =================================================================================
// ARQUIVO: models/User.js
// DESCRIÇÃO: Define o Schema para a coleção 'Users' no MongoDB.
//            Este modelo representa cada usuário individual do sistema, contendo
//            suas credenciais de acesso e informações de perfil.
// =================================================================================

import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    // Chave estrangeira que vincula o usuário à sua empresa.
    // Este é o campo mais crítico para garantir o isolamento de dados (multi-tenant).
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    // Nome completo do usuário.
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // E-mail de login do usuário. Deve ser único em todo o sistema.
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Armazena o hash da senha do usuário, nunca a senha em texto plano.
    // O campo é selecionado apenas quando explicitamente solicitado por segurança.
    passwordHash: {
      type: String,
      required: true,
      select: false, // Por padrão, não retorna este campo em consultas.
    },
    // Token temporário gerado para o fluxo de recuperação de senha.
    passwordResetToken: {
      type: String,
      select: false,
    },
    // Data de expiração do token de recuperação de senha.
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    // Chave estrangeira que define o nível de permissão do usuário (ex: ADMIN, USER).
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
    // Flag para "soft delete". Se `false`, o usuário não pode logar.
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Cria campos createdAt e updatedAt automaticamente
  }
);

export default mongoose.model("User", UserSchema);
