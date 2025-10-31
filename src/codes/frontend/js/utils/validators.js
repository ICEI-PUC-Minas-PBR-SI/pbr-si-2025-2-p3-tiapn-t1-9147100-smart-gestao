/**
 * @file Módulo de funções utilitárias para validação de dados.
 * @description Este arquivo contém funções genéricas para validar inputs de formulários.
 */

/**
 * Valida se um campo obrigatório não está vazio ou contém apenas espaços em branco.
 * @param {string} value - O valor do campo a ser validado.
 * @returns {boolean} - `true` se o campo não estiver vazio, `false` caso contrário.
 */
export function validateRequired(value) {
  return value && value.trim() !== '';
}

/**
 * Valida se uma string é um endereço de e-mail válido.
 * @param {string} email - O endereço de e-mail a ser validado.
 * @returns {boolean} - `true` se o e-mail for válido, `false` caso contrário.
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Valida se uma senha atende a critérios mínimos (ex: comprimento).
 * @param {string} password - A senha a ser validada.
 * @returns {boolean} - `true` se a senha for válida, `false` caso contrário.
 */
export function validatePassword(password) {
  return password.length >= 6; // Exemplo: mínimo de 6 caracteres.
}