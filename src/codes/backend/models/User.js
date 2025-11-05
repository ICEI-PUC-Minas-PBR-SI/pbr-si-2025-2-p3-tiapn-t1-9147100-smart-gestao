// ============================================================
// - Arquivo: models/User.js
// - Função: Estrutura do usuário (User) no banco MongoDB
// ============================================================

import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * - Schema de Usuário
 * Representa as credenciais e dados de cada usuário do sistema.
 * Está vinculado à empresa (Company) para restringir acesso aos dados.
 */
const UserSchema = new Schema(
  {
    // Chave estrangeira que vincula o usuário à sua empresa. Essencial para o isolamento de dados (multi-tenant).
    // `ref: "Company"` cria uma referência ao modelo 'Company'.
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Armazena a senha de forma segura, já criptografada (hash).
    passwordHash: {
      type: String,
      required: true,
    },
    // --- CAMPOS PARA RECUPERAÇÃO DE SENHA ---
    passwordResetToken: {
      type: String,
      select: false, // Não retorna este campo em queries por padrão
    },
    passwordResetExpires: {
      type: Date,
      select: false, // Não retorna este campo em queries por padrão
    },
    // -----------------------------------------
    // Chave estrangeira que define o nível de acesso do usuário.
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission", // Permissão associada (ADMIN_COMPANY, USER_COMPANY, etc.)
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Cria campos createdAt e updatedAt automaticamente
  }
);

/**
 * - Antes de remover o usuário, pode-se implementar um middleware
 * de auditoria ou bloqueio de exclusão de administradores.
 */

// Cria o model 'User' com base no schema (evita recriação em hot reload)
export default mongoose.model("User", UserSchema);
