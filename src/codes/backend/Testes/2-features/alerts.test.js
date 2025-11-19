import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const SETUP_FILE = path.join('Testes', 'test-setup.json');

let testData;

describe('6. Módulo de Alertas de Metas', () => {
  beforeAll(() => {
    // Carrega os dados de setup (usuários, tokens) criados pelo globalSetup
    if (fs.existsSync(SETUP_FILE)) {
      const rawData = fs.readFileSync(SETUP_FILE);
      testData = JSON.parse(rawData);
    } else {
      throw new Error('Arquivo de setup de teste não encontrado. Execute o setup global.');
    }
  });

  it('RF-006: deve criar um alerta quando uma despesa ultrapassa a meta da categoria', async () => {
    const { token, userId } = testData.companyA; // CORREÇÃO: userId agora é extraído dos dados de teste.
    const headers = { Authorization: `Bearer ${token}` };

    // 1. Criar uma meta de gastos de R$ 100 para a categoria "Alimentação"
    const goalData = {
      title: 'Meta de Alimentação',
      type: 'expense',
      category: 'Alimentação',
      targetAmount: 100,
      currentAmount: 0,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Início do mês atual
      deadline: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), // Fim do mês atual
    };

    const goalResponse = await axios.post(`${API_URL}/goals`, goalData, { headers });
    expect(goalResponse.status).toBe(201);
    const goalId = goalResponse.data.data._id; // CORREÇÃO: Acessando o caminho correto do ID.

    // 2. Criar uma primeira despesa de R$ 80 (abaixo da meta)
    const transaction1Data = {
      type: 'expense',
      category: 'Alimentação',
      description: 'Almoço executivo',
      userId,
      amount: 80,
      date: new Date(),
    };
    await axios.post(`${API_URL}/transactions`, transaction1Data, { headers });

    // 3. Verificar que nenhum alerta foi criado ainda
    let alertsResponse = await axios.get(`${API_URL}/alerts`, { headers });
    expect(alertsResponse.data.data).toHaveLength(0);

    // 4. Criar uma segunda despesa de R$ 30, ultrapassando a meta (80 + 30 = 110)
    const transaction2Data = {
      type: 'expense',
      category: 'Alimentação',
      description: 'Café da tarde',
      userId,
      amount: 30,
      date: new Date(),
    };
    await axios.post(`${API_URL}/transactions`, transaction2Data, { headers });

    // 5. Verificar se o alerta foi criado
    alertsResponse = await axios.get(`${API_URL}/alerts`, { headers });
    expect(alertsResponse.data.data).toHaveLength(1);
    const alert = alertsResponse.data.data[0];
    expect(alert.goalId).toBe(goalId);
    expect(alert.message).toContain('Sua meta de gastos para a categoria "Alimentação" foi atingida!');
    expect(alert.type).toBe('limit_reached');

    // 6. Criar uma terceira despesa para garantir que não seja criado um alerta duplicado
    const transaction3Data = {
        type: 'expense',
        category: 'Alimentação',
        description: 'Jantar',
        userId,
        amount: 50,
        date: new Date(),
      };
    await axios.post(`${API_URL}/transactions`, transaction3Data, { headers });

    alertsResponse = await axios.get(`${API_URL}/alerts`, { headers });
    expect(alertsResponse.data.data).toHaveLength(1); // Continua com apenas 1 alerta
  });
});