import axios from 'axios';
import fs from 'fs';
import path from 'path';

const SETUP_FILE = path.join('Testes', 'test-setup.json');

describe('5. Módulo de Metas (CRUD)', () => {
    let userToken;
    let API_URL;
    let createdGoalId;

    beforeAll(() => {
        // Lê os dados de setup de forma síncrona. O ambiente de teste garante que este arquivo já existe.
        const setupData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
        userToken = setupData.companyA.token;
        API_URL = setupData.apiUrl;
    });

    it('deve CRIAR uma nova meta com sucesso', async () => {
        const goalData = {
            title: 'Economizar para novo maquinário',
            type: 'saving',
            targetAmount: 10000,
            currentAmount: 1500,
            deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        };

        const response = await axios.post(`${API_URL}/goals`, goalData, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(201);
        expect(response.data.data).toHaveProperty('_id');
        expect(response.data.data.title).toBe(goalData.title);
        expect(response.data.data.targetAmount).toBe(goalData.targetAmount);

        createdGoalId = response.data.data._id; // Corrigido para pegar o ID do objeto de dados
    });

    it('deve LISTAR as metas do usuário logado', async () => {
        expect(createdGoalId).toBeDefined();

        const response = await axios.get(`${API_URL}/goals`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true); // CORREÇÃO: A API retorna os dados dentro de um objeto { data: [...] }
        const found = response.data.data.some(goal => goal._id === createdGoalId);
        expect(found).toBe(true);
    });

    it('deve ATUALIZAR uma meta existente', async () => {
        expect(createdGoalId).toBeDefined();

        const updatedData = {
            title: 'Economizar para novo maquinário (URGENTE)',
            currentAmount: 2000,
        };

        const response = await axios.put(`${API_URL}/goals/${createdGoalId}`, updatedData, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(200);
        expect(response.data.data.title).toBe(updatedData.title);
        expect(response.data.data.currentAmount).toBe(updatedData.currentAmount);
    });

    it('deve EXCLUIR uma meta existente', async () => {
        expect(createdGoalId).toBeDefined();

        const response = await axios.delete(`${API_URL}/goals/${createdGoalId}`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Meta removida com sucesso.');

        await expect(
            axios.get(`${API_URL}/goals/${createdGoalId}`, {
                headers: { Authorization: `Bearer ${userToken}` }
            })
        ).rejects.toThrow();
    });
});