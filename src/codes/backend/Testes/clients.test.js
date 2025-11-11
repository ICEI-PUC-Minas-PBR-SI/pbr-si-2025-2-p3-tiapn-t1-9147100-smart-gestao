/**
 * @file Testes para o Módulo de Clientes/Fornecedores (RF-009).
 * @description Este arquivo contém testes automatizados seguindo a abordagem TDD.
 *              Os testes devem falhar (com 404) inicialmente, e o objetivo do desenvolvimento
 *              futuro do backend será fazê-los passar.
 */
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const SETUP_FILE = path.join('Testes', 'test-setup.json');

describe('7. Módulo de Clientes/Fornecedores (TDD)', () => {
  let createdClientId;
  let companyA;
  let API_URL;

  beforeAll(() => {
    const setupData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
    companyA = setupData.companyA;
    API_URL = setupData.apiUrl;
  });

  test('deve CRIAR um novo cliente com sucesso', async () => {
    console.log('Executando teste para: RF-009 - CRIAR Cliente (Pendente)');
    const newClient = {
      name: 'Cliente de Teste TDD',
      type: 'client',
      email: 'cliente.tdd@example.com',
      document: '123.456.789-00',
    };

    const response = await axios.post(`${API_URL}/clients`, newClient, {
      headers: { Authorization: `Bearer ${companyA.token}` },
    });

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('_id');
    expect(response.data.name).toBe(newClient.name);
    createdClientId = response.data._id;
    console.log(`➡️  [PASS] Resposta da API: ${response.status}, Cliente criado com ID: ${createdClientId}`);
  });

  test('deve LISTAR os clientes da empresa', async () => {
    console.log('Executando teste para: RF-009 - LISTAR Clientes (Pendente)');
    const response = await axios.get(`${API_URL}/clients`, {
      headers: { Authorization: `Bearer ${companyA.token}` },
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    // Verifica se o cliente criado no teste anterior está na lista
    expect(response.data.some(client => client._id === createdClientId)).toBe(true);
    console.log(`➡️  [PASS] Resposta da API: ${response.status}, ${response.data.length} cliente(s) listado(s).`);
  });
});