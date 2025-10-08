// scripts/initPermissions.js
// Executar uma vez para popular permissões iniciais

import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "../config/db.js";
import Permission from "../models/Permission.js";

async function run() {
  await connectDB();
  const perms = [
    { nome: "ADMIN", descricao: "Administrador total" },
    { nome: "USER", descricao: "Usuário comum" },
    { nome: "MANAGER", descricao: "Gerenciar clientes e transacoes" }
  ];
  for (const p of perms) {
    const exists = await Permission.findOne({ nome: p.nome });
    if (!exists) {
      await Permission.create(p);
      console.log("Criada permissão:", p.nome);
    } else {
      console.log("Permissão já existe:", p.nome);
    }
  }
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
