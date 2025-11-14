// =================================================================================
// ARQUIVO: Testes/2-features/clients.test.js
//
// DESCRIÇÃO: Suíte de testes para o Módulo de Clientes e Fornecedores (CRUD).
//            Valida o ciclo de vida completo: criação, listagem, atualização e exclusão,
//            garantindo que todas as operações funcionem como esperado.
// =================================================================================

import axios from 'axios';
import fs from 'fs';
import path from 'path';

const SETUP_FILE = path.join('Testes', 'test-setup.json'); // Caminho relativo para o arquivo de setup

describe('7. Módulo de Clientes/Fornecedores', () => {
  let userToken;
  let API_URL;
  let createdClientId;

  beforeAll(async () => {
    // Carrega os dados de setup, como a URL da API e o token de autenticação da Empresa A.
    // Lê os dados de setup de forma síncrona. O ambiente de teste garante que este arquivo já existe.
    const setupData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
    userToken = setupData.companyA.token;
    API_URL = setupData.apiUrl;
  });

  // Limpa o cliente criado ao final de todos os testes deste arquivo
  // para garantir que não haja "lixo" de teste no banco de dados.
  afterAll(async () => {
    if (createdClientId) {
      await axios.delete(`${API_URL}/clients/${createdClientId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      }).catch(() => {}); // Ignora erros se já foi deletado
    }
  });

  test('deve CRIAR um novo cliente com sucesso', async () => {
    const newClient = {
      name: `Cliente de Teste - ${Date.now()}`,
      email: `cliente.${Date.now()}@teste.com`,
      type: 'client',
    };

    const response = await axios.post(`${API_URL}/clients`, newClient, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    expect(response.status).toBe(201);
    expect(response.data.data).toHaveProperty('_id');
    expect(response.data.data.name).toBe(newClient.name);
    createdClientId = response.data.data._id;
  });

  test('deve LISTAR os clientes da empresa', async () => {
    const response = await axios.get(`${API_URL}/clients`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.data)).toBe(true);
    const found = response.data.data.some(client => client._id === createdClientId);
    expect(found).toBe(true);
  });

  test('deve ATUALIZAR um cliente existente', async () => {
    const updatedData = {
      name: `Cliente Atualizado - ${Date.now()}`,
    };

    const response = await axios.put(`${API_URL}/clients/${createdClientId}`, updatedData, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    expect(response.status).toBe(200);
    expect(response.data.data.name).toBe(updatedData.name);
  });

  test('deve EXCLUIR um cliente existente', async () => {
    const response = await axios.delete(`${API_URL}/clients/${createdClientId}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Cliente removido com sucesso.');

    createdClientId = null;
  });
});