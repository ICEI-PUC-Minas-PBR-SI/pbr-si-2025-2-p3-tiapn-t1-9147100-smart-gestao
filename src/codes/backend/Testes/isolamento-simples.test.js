// =================================================================================
// ARQUIVO: Testes/isolamento-simples.test.js
// DESCRIÇÃO: Suíte de testes rápida para validar o isolamento de dados (multi-tenant)
//            entre duas empresas específicas (A e B).
// =================================================================================

import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000/api';
const SETUP_FILE = path.join('Testes', 'test-setup.json');

let tokenEmpresaA;
let tokenEmpresaB;
let transactionIdEmpresaA;

/**
 * @describe Bloco de testes para o Módulo de Isolamento de Dados (Simples).
 */
describe('2. Teste de Isolamento de Dados (Simples)', () => {
    beforeAll(async () => {
        const testData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
        tokenEmpresaA = testData.companyA.token;
        tokenEmpresaB = testData.companyB.token;
    }, 30000); // Aumenta o timeout para o setup, pois envolve várias requisições

    // Este teste agora é mais robusto e cobre múltiplos cenários de isolamento
    /**
     * @test Cenário completo de isolamento de dados.
     * @description Cria uma transação para a Empresa A e verifica se a Empresa B
     *              não consegue ler, atualizar ou excluir essa transação.
     */
    it('deve impedir o acesso, modificação e exclusão de transações entre empresas', async () => {
        // --- 1. Criar uma transação com tokenEmpresaA ---
        const createTransaction = await axios.post(`${API_URL}/transactions`, {
            description: 'Transação de Teste Empresa A',
            amount: 100,
            type: 'expense',
            date: new Date()
        }, {
            headers: {
                Authorization: `Bearer ${tokenEmpresaA}`
            }
        });

        expect(createTransaction.status).toBe(201);
        transactionIdEmpresaA = createTransaction.data._id;

        // --- 2. Tentar buscar essa transação com tokenEmpresaB ---
        try {
            await axios.get(`${API_URL}/transactions/${transactionIdEmpresaA}`, { // Tenta buscar
                headers: { Authorization: `Bearer ${tokenEmpresaB}` }
            });
            fail('Empresa B conseguiu LER a transação da Empresa A.');
        } catch (error) {
            expect(error.response.status).not.toBe(200);
        }

        // --- 4. Tentar modificar essa transação com tokenEmpresaB ---
        const updateData = { description: 'Tentativa de Modificação pela Empresa B', amount: 999 };

        try {
            await axios.put(`${API_URL}/transactions/${transactionIdEmpresaA}`, updateData, {
                headers: { Authorization: `Bearer ${tokenEmpresaB}` }
            });
            fail('Empresa B conseguiu ATUALIZAR a transação da Empresa A.');
        } catch (error) {
            expect(error.response.status).not.toBe(200);
        }

        // --- 5. Tentar excluir essa transação com tokenEmpresaB ---
        try {
            await axios.delete(`${API_URL}/transactions/${transactionIdEmpresaA}`, {
                headers: { Authorization: `Bearer ${tokenEmpresaB}` }
            });
            fail('Empresa B conseguiu EXCLUIR a transação da Empresa A.');
        } catch (error) {
            expect(error.response.status).not.toBe(200);
        }
    });

    /**
     * @test Cenário de isolamento na listagem de dados.
     * @description Garante que o endpoint de listagem de transações da Empresa B
     *              não retorna, em nenhuma hipótese, transações da Empresa A.
     */
    it('deve impedir que a Empresa B liste todas as transações da Empresa A', async () => {
        const responseB = await axios.get(`${API_URL}/transactions`, { 
            headers: { Authorization: `Bearer ${tokenEmpresaB}` }
        });

        expect(responseB.status).toBe(200);

        // Verifica se a transação da Empresa A NÃO está na lista retornada para a Empresa B
        const transacaoEncontrada = Array.isArray(responseB.data) ? responseB.data.find(t => t._id === transactionIdEmpresaA) : undefined;
        expect(transacaoEncontrada).toBeUndefined();
    });

});