// models/Permission.js
// Permissões / papéis (RBAC simples)

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PermissionSchema = new Schema({
  nome: { type: String, required: true, unique: true }, // ex: "ADMIN", "USER", "MANAGER"
  descricao: { type: String }
}, { timestamps: true });

export default model("Permission", PermissionSchema);
