import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';

const SETUP_FILE = path.join('Testes', 'test-setup.json');

describe('7. Módulo de Clientes/Fornecedores', () => {
  let userToken;
  let API_URL;
  let createdClientId;

  beforeAll(() => {
    // Lê os dados de setup de forma síncrona. O ambiente de teste garante que este arquivo já existe.
    const setupData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
    userToken = setupData.companyA.token;
    API_URL = setupData.apiUrl;
  });

  it('deve CRIAR um novo cliente com sucesso', async () => {
    const newClient = {
      name: faker.company.name(),
      email: faker.internet.email(),
      type: 'client',
      document: faker.string.numeric(14),
    };

    const response = await axios.post(`${API_URL}/clients`, newClient, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    expect(response.status).toBe(201);
    expect(response.data.data).toHaveProperty('_id');
    expect(response.data.data.name).toBe(newClient.name);
    createdClientId = response.data.data._id; // Corrigido para pegar o ID do objeto de dados
  });

  it('deve LISTAR os clientes da empresa', async () => {
    const response = await axios.get(`${API_URL}/clients`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.data)).toBe(true); // CORREÇÃO: A API retorna os dados dentro de um objeto { data: [...] }
    const found = response.data.data.some(client => client._id === createdClientId);
    expect(found).toBe(true);
  });

  it('deve ATUALIZAR um cliente existente', async () => {
    const updatedData = {
      name: `Cliente Atualizado - ${faker.company.name()}`,
    };

    const response = await axios.put(`${API_URL}/clients/${createdClientId}`, updatedData, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    expect(response.status).toBe(200);
    expect(response.data.data.name).toBe(updatedData.name);
  });

  it('deve EXCLUIR um cliente existente', async () => {
    const response = await axios.delete(`${API_URL}/clients/${createdClientId}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Cliente removido com sucesso.');

    // Tenta buscar o cliente excluído e espera um erro 404
    await expect(
      axios.get(`${API_URL}/clients/${createdClientId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
    ).rejects.toThrow('Request failed with status code 404');
  });
});