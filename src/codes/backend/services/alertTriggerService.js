/**
 * =================================================================================
 * ARQUIVO: services/alertTriggerService.js
 * DESCRIÇÃO: Serviço dedicado responsável por verificar se uma transação dispara
 *            algum alerta de meta financeira.
 * =================================================================================
 */

import Goal from '../models/Goal.js';
import Transaction from '../models/Transaction.js';
import Alert from '../models/Alert.js';
import { createLog } from '../utils/logger.js';

/**
 * Verifica se a criação de uma nova transação de despesa viola alguma meta de gastos
 * e, em caso afirmativo, cria um alerta de forma segura e sem condições de corrida.
 *
 * @param {object} transaction - A transação que acabou de ser criada.
 */
export const checkGoalOnTransactionCreate = async (transaction) => {
  // 1. O serviço só atua sobre transações do tipo 'expense'.
  if (transaction.type !== 'expense') {
    return;
  }

  try {
    const { companyId, category, userId, amount, _id } = transaction;

    // 2. Busca por uma meta de despesa ativa para a mesma empresa e categoria.
    const relatedGoal = await Goal.findOne({
      companyId,
      category,
      type: 'expense',
      startDate: { $lte: transaction.date },
      deadline: { $gte: transaction.date },
    });

    if (!relatedGoal) {
      return;
    }

    // 3. Lógica robusta para evitar "race conditions" (condições de corrida):
    // Calcula o total de despesas ANTES da transação atual.
    const previousExpensesResult = await Transaction.aggregate([
      {
        $match: {
          _id: { $ne: _id }, // Exclui a transação atual da soma
          companyId: companyId,
          category: category,
          type: 'expense',
          date: { $gte: relatedGoal.startDate, $lte: relatedGoal.deadline },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const previousTotal = previousExpensesResult[0]?.total || 0;
    const newTotal = previousTotal + amount;

    // 4. Compara os totais para disparar o alerta apenas no momento exato em que o limite é cruzado (antes < meta, depois >= meta).
    if (newTotal >= relatedGoal.targetAmount && previousTotal < relatedGoal.targetAmount) {
      // 5. Cria o novo alerta.
      await Alert.create({
        companyId,
        goalId: relatedGoal._id,
        userId: userId,
        type: 'limit_reached',
        message: `Sua meta de gastos para a categoria "${category}" foi atingida!`,
      });

      // Log de auditoria para o alerta criado.
      await createLog({
        userId: userId,
        companyId,
        action: 'AUTO_CREATE_ALERT',
        description: `Alerta gerado automaticamente para a meta "${relatedGoal.title}".`,
      });
    }
  } catch (error) {
    console.error('Falha ao verificar metas e criar alerta:', error);
  }
};