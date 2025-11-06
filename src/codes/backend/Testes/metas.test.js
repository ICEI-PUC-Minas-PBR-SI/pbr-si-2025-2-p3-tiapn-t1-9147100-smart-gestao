import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000/api';
const SETUP_FILE = path.join('Testes', 'test-setup.json');

describe('5. Módulo de Metas (CRUD)', () => {
    let userToken;
    let createdGoalId;

    // Antes de todos os testes, lê os dados da empresa de teste criada pelo setup global.
    beforeAll(() => {
        const testData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
        userToken = testData.companyA.token;
    });

    it('deve CRIAR uma nova meta com sucesso', async () => {
        const goalData = {
            // Payload padronizado para corresponder ao novo modelo
            title: 'Economizar para novo maquinário',
            type: 'saving',
            targetAmount: 10000,
            currentAmount: 1500,
            deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        };

        const response = await axios.post(`${API_URL}/meta`, goalData, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('_id');
        expect(response.data.title).toBe(goalData.title);
        expect(response.data.targetAmount).toBe(goalData.targetAmount);

        createdGoalId = response.data._id;
    });

    it('deve LISTAR as metas do usuário logado', async () => {
        expect(createdGoalId).toBeDefined();

        const response = await axios.get(`${API_URL}/meta`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        const found = response.data.some(goal => goal._id === createdGoalId);
        expect(found).toBe(true);
    });

    it('deve ATUALIZAR uma meta existente', async () => {
        expect(createdGoalId).toBeDefined();

        const updatedData = {
            title: 'Economizar para novo maquinário (URGENTE)',
            currentAmount: 2000,
        };

        const response = await axios.put(`${API_URL}/meta/${createdGoalId}`, updatedData, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(200);
        expect(response.data.title).toBe(updatedData.title);
        expect(response.data.currentAmount).toBe(updatedData.currentAmount);
    });

    it('deve EXCLUIR uma meta existente', async () => {
        expect(createdGoalId).toBeDefined();

        const response = await axios.delete(`${API_URL}/meta/${createdGoalId}`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Meta removida com sucesso');

        // Tenta buscar a meta excluída e espera um erro 404
        await expect(
            axios.get(`${API_URL}/meta/${createdGoalId}`, {
                headers: { Authorization: `Bearer ${userToken}` }
            })
        ).rejects.toThrow(expect.objectContaining({
            response: expect.objectContaining({
                status: 404
            })
        }));
    });
});