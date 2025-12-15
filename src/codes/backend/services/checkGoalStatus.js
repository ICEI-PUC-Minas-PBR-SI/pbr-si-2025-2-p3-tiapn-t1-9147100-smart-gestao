/**
 * =================================================================================
 * ARQUIVO: services/checkGoalStatus.js
 * DESCRIÇÃO: Serviço responsável por verificar o status das metas financeiras
 *            após a criação de novas transações.
 * =================================================================================
 */

import Goal from '../models/Goal.js';
import Transaction from '../models/Transaction.js';
import Alert from '../models/Alert.js';
import { createLog } from '../utils/logger.js';

/**
 * Verifica se a criação de uma nova transação de despesa viola alguma meta de gastos
 * e, em caso afirmativo, cria um alerta.
 *
 * @param {object} transaction - A transação que acabou de ser criada.
 */
export const checkExpenseGoalOnCreate = async (transaction) => {
  // 1. Ignora se a transação não for uma despesa.
  if (transaction.type !== 'expense') {
    return;
  }

  try {
    const { companyId, category, createdBy } = transaction;

    // 2. Busca por metas de despesa ativas para a mesma empresa e categoria.
    const relatedGoal = await Goal.findOne({
      companyId,
      category,
      type: 'expense',
      // Adicionar lógica de data se as metas tiverem prazo
      // endDate: { $gte: new Date() }
    });

    if (!relatedGoal) {
      return; // Nenhuma meta correspondente encontrada.
    }

    // 3. Calcula o total de despesas para a categoria da meta.
    const totalExpensesResult = await Transaction.aggregate([
      {
        $match: {
          companyId: companyId,
          category: category,
          type: 'expense',
          // Adicionar filtro de data se as metas tiverem prazo
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totalExpenses = totalExpensesResult[0]?.total || 0;

    // 4. Compara o total de despesas com o valor alvo da meta.
    if (totalExpenses >= relatedGoal.targetValue) {
      // 5. Verifica se já existe um alerta ativo para esta meta para evitar duplicatas.
      const existingAlert = await Alert.findOne({
        companyId,
        goalId: relatedGoal._id,
        type: 'limit_reached',
      });

      if (existingAlert) {
        return; // Alerta já existe.
      }

      // 6. Cria o novo alerta.
      const newAlert = await Alert.create({
        companyId,
        goalId: relatedGoal._id,
        userId: createdBy, // O usuário que criou a transação que disparou o alerta.
        type: 'limit_reached',
        message: `Sua meta de gastos para a categoria "${category}" foi atingida!`,
        status: 'active',
      });

      // Log de auditoria para o alerta criado.
      await createLog({
        userId: createdBy,
        companyId,
        action: 'AUTO_CREATE_ALERT',
        description: `Alerta gerado automaticamente para a meta "${relatedGoal.title}".`,
      });
    }
  } catch (error) {
    console.error('Falha ao verificar metas e criar alerta:', error);
    // A falha neste processo não deve impedir a criação da transação.
  }
};
