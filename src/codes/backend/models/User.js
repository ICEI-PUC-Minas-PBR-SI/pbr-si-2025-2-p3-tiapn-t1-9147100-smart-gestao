// models/User.js
// Representa o usuário vinculado a uma empresa (multi-tenant)
// Inclui criptografia de senha, código único e controle de acesso

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid"; // gera identificadores únicos (UUID)

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  empresaId: { type: Schema.Types.ObjectId, ref: "Empresa", required: true },
  uuid: { type: String, default: uuidv4, unique: true }, // código único interno do usuário
  nome: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  senha_hash: { type: String, required: true },
  role: { type: String, enum: ["ADMIN_EMPRESA", "USUARIO_COMUM"], default: "USUARIO_COMUM" },
  ativo: { type: Boolean, default: true },
  data_cadastro: { type: Date, default: Date.now },
  ultimo_login: { type: Date }
}, { timestamps: true });

// 🔒 Antes de salvar, gera hash da senha se foi modificada
UserSchema.pre("save", async function(next) {
  if (!this.isModified("senha_hash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.senha_hash = await bcrypt.hash(this.senha_hash, salt);
  next();
});

// 🔑 Método de comparação de senha (login)
UserSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.senha_hash);
};

// ⚙️ Impede e-mails duplicados dentro da mesma empresa
UserSchema.index({ empresaId: 1, email: 1 }, { unique: true });

export default model("User", UserSchema);


// models/User.js (trecho)
const UserSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  uuid: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true }, // renomeado
  role: { type: String, enum: ["ROOT","ADMIN_COMPANY","USER","VIEW_ONLY"], default: "USER" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

// index composto para unicidade por empresa
UserSchema.index({ companyId: 1, email: 1 }, { unique: true });

// hook para hash senha (se campo for passwordHash)
userSchema.pre("save", async function(next){
  if (!this.isModified("passwordHash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});
