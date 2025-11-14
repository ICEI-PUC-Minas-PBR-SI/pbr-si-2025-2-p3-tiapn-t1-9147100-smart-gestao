// =================================================================================
// ARQUIVO: models/Client.js
// DESCRIÇÃO: Define o Schema para a coleção 'Clients' no MongoDB.
//            Este modelo é versátil e usado para registrar tanto clientes quanto fornecedores,
//            diferenciados pelo campo 'type'.
// =================================================================================

import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  // Chave estrangeira que vincula o cliente/fornecedor à sua respectiva empresa.
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true, // Indexar este campo acelera as consultas de filtragem por empresa.
  },
  // Nome ou Razão Social do cliente/fornecedor.
  name: { type: String, required: true, trim: true },
  // Define se o registro é um cliente ('client') ou um fornecedor ('supplier').
  type: { type: String, enum: ['client', 'supplier'], required: true },
  // E-mail de contato.
  email: { type: String, trim: true, lowercase: true },
  // Documento (CPF ou CNPJ).
  document: { type: String, trim: true },
}, {
  // Adiciona os campos `createdAt` e `updatedAt` automaticamente.
  timestamps: true,
});

// Índice composto que garante que o mesmo cliente/fornecedor (com o mesmo nome)
// não possa ser cadastrado duas vezes para a mesma empresa, mantendo a integridade dos dados.
clientSchema.index({ companyId: 1, name: 1, type: 1 }, { unique: true });

const Client = mongoose.model('Client', clientSchema);
export default Client;