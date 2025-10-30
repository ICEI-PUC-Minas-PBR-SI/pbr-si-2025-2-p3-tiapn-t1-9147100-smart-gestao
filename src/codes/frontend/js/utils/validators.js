/**
 * Arquivo com funções utilitárias para validação e formatação de dados
 */

/**
 * Valida se um email está em formato válido
 * @param {string} email - Email a ser validado
 * @returns {boolean} true se o email é válido, false caso contrário
 */
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Valida se uma senha atende aos requisitos mínimos
 * @param {string} password - Senha a ser validada
 * @returns {boolean} true se a senha tem 6 ou mais caracteres
 */
export function validatePassword(password) {
    return password.length >= 6;
}

/**
 * Verifica se um campo obrigatório foi preenchido
 * @param {string} value - Valor a ser validado
 * @returns {boolean} true se o campo não está vazio
 */
export function validateRequired(value) {
    return value && value.trim().length > 0;
}

/**
 * Valida se um CNPJ está em formato válido
 * @param {string} cnpj - CNPJ a ser validado
 * @returns {boolean} true se o CNPJ é válido
 */
export function validateCNPJ(cnpj) {
    // Remove caracteres especiais (pontos, traços, barras)
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    // Verifica se tem exatamente 14 dígitos
    if (cnpj.length !== 14) return false;
    
    // Verifica se todos os dígitos são iguais (caso inválido)
    if (/^(\d)\1+$/.test(cnpj)) return false;
    
    return true;
}

/**
 * Valida se um valor monetário é válido
 * @param {number|string} value - Valor a ser validado
 * @returns {boolean} true se é um número positivo
 */
export function validateMoney(value) {
    return !isNaN(parseFloat(value)) && value >= 0;
}

/**
 * Formata um valor numérico para moeda brasileira
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado (ex: R$ 1.234,56)
 */
export function formatMoney(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Formata uma data para o padrão brasileiro
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data formatada (ex: 29/10/2025)
 */
export function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}