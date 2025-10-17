// ============================================================
// 🛡️ Arquivo: scripts/initPermissions.js
// 🎯 Função: Cria e inicializa as permissões padrão do sistema Smart Gestão
// ============================================================

import Permission from "../models/Permission.js"; // Importa o model de permissões

/**
 * 🔧 Função initPermissions()
 * ----------------------------------------
 * Responsável por verificar se já existem permissões cadastradas no banco.
 * Caso não existam, insere automaticamente as permissões padrão:
 *  - ROOT → acesso total ao sistema
 *  - ADMIN_COMPANY → administrador de uma empresa
 *  - USER_COMPANY → usuário comum vinculado à empresa
 *  - READ_ONLY → acesso apenas para leitura
 *
 * Essa função é executada no startup do servidor (server.js),
 * logo após a conexão com o MongoDB ser estabelecida.
 */
export const initPermissions = async () => {
  try {
    console.log("🔍 Verificando permissões existentes...");

    // Conta quantos documentos existem na coleção Permission
    const count = await Permission.countDocuments();

    // Se já houver permissões cadastradas, não cria novamente
    if (count > 0) {
      console.log("🔒 Permissões já existentes no banco. Nenhuma alteração necessária.");
      return;
    }

    // Define o conjunto padrão de permissões do sistema
    const permissions = [
      {
        name: "ROOT",
        description: "Acesso total ao sistema (donos e administradores gerais do sistema).",
      },
      {
        name: "ADMIN_COMPANY",
        description: "Administrador da empresa. Pode gerenciar usuários e dados da própria empresa.",
      },
      {
        name: "USER_COMPANY",
        description: "Usuário padrão da empresa, com acesso aos dados da própria organização.",
      },
      {
        name: "READ_ONLY",
        description: "Usuário com acesso apenas de leitura. Não pode criar, editar ou excluir.",
      },
    ];

    // Insere os documentos no banco (criação em lote)
    await Permission.insertMany(permissions);

    console.log("✅ Permissões padrão criadas com sucesso!");
    console.table(permissions.map((p) => ({ Nome: p.name, Descrição: p.description })));
  } catch (error) {
    // Captura e exibe erros durante o processo de inicialização
    console.error("❌ Erro ao inicializar permissões padrão:");
    console.error(error.message);
  }
};
