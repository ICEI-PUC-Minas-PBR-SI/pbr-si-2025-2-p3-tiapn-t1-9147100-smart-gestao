/**
 * =================================================================================
 * ARQUIVO: utils/constants.js
 * DESCRIÇÃO: Centraliza valores constantes e "strings mágicas" do sistema.
 *            O uso de constantes em vez de strings literais no código previne
 *            erros de digitação e facilita a manutenção, pois qualquer alteração
 *            precisa ser feita em um único lugar.
 * =================================================================================
 */

// Níveis de Permissão (Roles)

// Permissão de usuário padrão, atribuída a novos usuários de uma empresa.
export const USER_COMPANY = 'USER_COMPANY';
// Permissão de administrador da empresa, com privilégios de gerenciamento.
export const ADMIN_COMPANY = 'ADMIN_COMPANY';
// Permissão de superusuário, com acesso irrestrito ao sistema.
export const ROOT = 'ROOT';