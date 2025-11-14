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
    // Chave estrangeira que vincula o usuário à sua empresa. Essencial para a arquitetura multi-tenant.
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true, // Indexar este campo acelera a busca de todos os usuários de uma empresa.
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
      unique: true, // Garante que não existam dois usuários com o mesmo e-mail.
      lowercase: true,
      trim: true,
    },
    // Armazena o hash da senha, nunca a senha em texto plano. `select: false` impede que este campo seja retornado em consultas por padrão.
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    // Hash do token temporário gerado para o fluxo de recuperação de senha.
    passwordResetToken: {
      type: String,
      select: false,
    },
    // Data de expiração do token de recuperação de senha.
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    // Chave estrangeira que define o nível de permissão do usuário (ex: ADMIN_COMPANY, USER_COMPANY).
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
    // Flag para "soft delete". Se `false`, o usuário é considerado inativo e não pode logar.
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adiciona `createdAt` e `updatedAt` automaticamente.
  }
);

export default mongoose.model("User", UserSchema);
