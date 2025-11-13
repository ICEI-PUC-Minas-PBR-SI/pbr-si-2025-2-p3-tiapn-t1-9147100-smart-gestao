// =================================================================================
// ARQUIVO: controllers/clientController.js
// DESCRIÇÃO: Controladores para as operações CRUD da entidade 'Client'.
//            Gerencia o cadastro e a manipulação de clientes e fornecedores,
//            garantindo que todas as operações sejam restritas à empresa do usuário.
// =================================================================================

import Client from '../models/Client.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

// @desc    Criar um novo cliente
// @route   POST /api/clients
// @access  Private
export const createClient = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      companyId: req.user.companyId, // Pega o ID da empresa do token do usuário logado
    };
    const createdClient = await Client.create(payload);
    return successResponse(res, { status: 201, data: createdClient });
  } catch (error) {
    return errorResponse(res, { status: 400, message: 'Erro ao criar cliente.', errors: error });
  }
};

// @desc    Listar todos os clientes da empresa logada
// @route   GET /api/clients
// @access  Private
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ companyId: req.user.companyId });
    return successResponse(res, { data: clients });
  } catch (error) {
    return errorResponse(res, { status: 500, message: 'Erro ao listar clientes.', errors: error });
  }
};

// @desc    Atualizar um cliente
// @route   PUT /api/clients/:id
// @access  Private
export const updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedClient) return errorResponse(res, { status: 404, message: 'Cliente não encontrado.' });
    return successResponse(res, { data: updatedClient });
  } catch (error) {
    return errorResponse(res, { status: 400, message: 'Erro ao atualizar cliente.', errors: error });
  }
};

// @desc    Deletar um cliente
// @route   DELETE /api/clients/:id
// @access  Private
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
    if (!client) {
      return errorResponse(res, { status: 404, message: 'Cliente não encontrado.' });
    }
    return successResponse(res, { message: 'Cliente removido com sucesso.' });
  } catch (error) {
    return errorResponse(res, { status: 500, message: 'Erro ao remover cliente.', errors: error });
  }
};