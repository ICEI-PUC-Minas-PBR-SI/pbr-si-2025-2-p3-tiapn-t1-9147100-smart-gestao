// =================================================================================
// ARQUIVO: models/Permission.js
// DESCRIÇÃO: Define o Schema para a coleção 'Permissions' no MongoDB.
//            Este modelo armazena os diferentes níveis de acesso (papéis/roles)
//            que um usuário pode ter no sistema, como 'ROOT', 'ADMIN_COMPANY', etc.
// =================================================================================

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PermissionSchema = new Schema(
  {
    // Campo adicional para compatibilidade com índices antigos que usavam 'nome'
    nome: {
      type: String,
      trim: true,
      uppercase: true,
      // Não obrigatório no modelo novo, mas será preenchido pelo seeding para
      // evitar conflitos com índices históricos no banco.
      required: false,
    },
    // Nome único da permissão, usado internamente para verificações de autorização (RBAC - Role-Based Access Control).
    name: {
      type: String,
      required: true,
      unique: true,   // Garante que não existam permissões com o mesmo nome.
      trim: true,
      uppercase: true // Padroniza todos os nomes para maiúsculas para evitar inconsistências (ex: 'admin' vs 'ADMIN') nas checagens.
    },
    // Descrição textual amigável explicando o que a permissão concede ao usuário.
    description: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true, // Adiciona `createdAt` e `updatedAt` automaticamente.
  }
);

export default mongoose.models.Permission || model("Permission", PermissionSchema);
