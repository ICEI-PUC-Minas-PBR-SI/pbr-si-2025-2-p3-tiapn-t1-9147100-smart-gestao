// =================================================================================
// ARQUIVO: scripts/initPermissions.js
// DESCRIÇÃO: Contém um script de inicialização que garante que as permissões
//            (roles) essenciais do sistema existam no banco de dados.
//            Este script é executado na inicialização do servidor.
// =================================================================================

import Permission from "../models/Permission.js";

/**
 * Garante que as permissões de acesso padrão existam no banco de dados.
 * Esta função é idempotente: ela primeiro verifica se alguma permissão já existe.
 * Se a coleção 'Permissions' estiver vazia, ela a popula com os papéis
 * essenciais para o funcionamento do sistema. Caso contrário, não faz nada.
 * É chamada durante a inicialização do servidor (`server.js`).
 */
export const initPermissions = async () => {
  try {
    console.log("Verificando permissões de sistema...");

    // Conta eficientemente o número de documentos na coleção de permissões.
    const count = await Permission.countDocuments();

    // Se já existir pelo menos uma permissão, assume-se que o banco já foi inicializado.
    if (count > 0) {
      console.log("Permissões de sistema já existem. Nenhuma ação necessária.");
      return;
    }

    // Array contendo as permissões padrão que são a base do controle de acesso.
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

    // Usa `insertMany` para inserir todas as permissões em uma única operação de banco de dados.
    await Permission.insertMany(permissions);

    console.log("Permissões padrão criadas com sucesso!");
    console.table(permissions.map((p) => ({ Nome: p.name, Descrição: p.description })));
  } catch (error) {
    // Em caso de falha, loga o erro e permite que a aplicação continue,
    // embora o controle de acesso possa não funcionar como esperado.
    console.error("Erro crítico ao inicializar permissões padrão:");
    console.error(error.message);
  }
};
