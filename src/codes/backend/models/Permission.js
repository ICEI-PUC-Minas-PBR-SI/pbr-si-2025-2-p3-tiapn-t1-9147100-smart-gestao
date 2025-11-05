// ============================================================
// - models/Permission.js
// - Estrutura da collection de permissões de acesso no sistema
// ============================================================

import mongoose from "mongoose";

const { Schema, model } = mongoose;

// - Schema das permissões do sistema
// Cada permissão define o nível de acesso que um usuário pode ter.
const PermissionSchema = new Schema(
  {
    // Nome da permissão (ex: ROOT, ADMIN_COMPANY)
    name: {
      type: String,
      required: true, // campo obrigatório
      unique: true,   // evita duplicações
      trim: true,     // remove espaços desnecessários
      uppercase: true // mantém padrão consistente
    },

    // Descrição explicando o que essa permissão representa
    description: {
      type: String,
      required: true
    },

    // Data de criação automática
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: "Permissions"
  }
);

export default model("Permission", PermissionSchema);
