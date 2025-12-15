// =================================================================================
// ARQUIVO: scripts/initPermissions.js
// DESCRIÇÃO: Script de inicialização que garante que as permissões (roles)
//            essenciais do sistema existam no banco de dados. Este script é
//            **idempotente**, o que significa que pode ser executado várias
//            vezes sem causar duplicatas ou erros.
// =================================================================================

import Permission from "../models/Permission.js";

/**
 * Garante que as permissões de acesso padrão existam no banco de dados.
 * Esta função é idempotente: ela primeiro verifica se as permissões já existem; se
 * não, ela as cria. Caso contrário, não faz nada.
 * É chamada durante a inicialização do servidor (`server.js`).
 */
export const initPermissions = async () => {
  try {
    console.log("Verificando permissões de sistema...");

    // Verificação de Idempotência: Checa se a permissão 'ROOT' já existe.
    // Se existir, assume-se que o script já rodou e não é necessário fazer mais
    // nada.
    const ROOT = 'ROOT';
    const ADMIN_COMPANY = 'ADMIN_COMPANY';
    const USER_COMPANY = 'USER_COMPANY';
    const rootPermissionExists = await Permission.findOne({ name: ROOT });

    if (rootPermissionExists) {
      console.log("Permissões de sistema já existem. Nenhuma ação necessária.");
      return;
    }

    // Se as permissões não existem, o script as cria.
    console.log("Permissões não encontradas. Criando permissões padrão...");

    // Array com as permissões padrão que formam a base do controle de acesso (RBAC).

    const permissions = [
      {
        name: ROOT,
        description: "Superusuário. Acesso irrestrito a todos os dados e configurações do sistema.",
      },
      {
        name: ADMIN_COMPANY,
        nome: ADMIN_COMPANY,
        description: "Administrador de uma empresa. Pode gerenciar usuários e todos os dados da sua própria empresa.",
      },
      {
        name: USER_COMPANY,
        nome: USER_COMPANY,
        description: "Usuário padrão. Pode criar e gerenciar seus próprios dados dentro da empresa.",
      },
    ];

    // Usa `insertMany` para inserir todas as permissões em uma única operação de banco de dados.
    await Permission.insertMany(permissions, { ordered: false });

    console.log("Permissões padrão criadas com sucesso!");
    console.table(permissions.map((p) => ({ Nome: p.name, Descrição: p.description })));

  } catch (error) {
    // Em caso de falha, loga o erro e permite que a aplicação continue,
    // embora o controle de acesso possa não funcionar como esperado.
    console.error("Erro crítico ao inicializar permissões padrão:");
    console.error(error.message);
  }
};
