// Scripts/initPermissions.js
// Inicializa no banco as permissões padrões do sistema.
// Uso: chamar no startup (após connectDB).

import Permission from "../models/Permission.js";

/**
 * initPermissions - cria roles padrão caso não existam
 */
export const initPermissions = async () => {
  try {
    const count = await Permission.countDocuments();
    if (count > 0) {
      console.log("🔒 Permissões já existentes no banco. Nenhuma alteração necessária.");
      return;
    }

    const permissions = [
      { name: "ROOT", description: "Acesso total ao sistema (donos do sistema)." },
      { name: "ADMIN_COMPANY", description: "Administrador da empresa, gerencia usuários e dados da própria company." },
      { name: "USER_COMPANY", description: "Usuário comum da company; pode manipular dados da própria company." },
      { name: "READ_ONLY", description: "Apenas leitura de informações." },
    ];

    await Permission.insertMany(permissions);
    console.log("✅ Permissões padrão (ROOT, ADMIN_COMPANY, USER_COMPANY, READ_ONLY) criadas com sucesso.");
  } catch (error) {
    console.error("Erro ao inicializar permissões:", error);
  }
};
