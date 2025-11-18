// =================================================================================
// ARQUIVO: utils/responseHelper.js
// DESCRIÇÃO: Funções auxiliares para padronizar as respostas JSON da API.
//            O uso desses helpers garante que o frontend sempre receba uma
//            estrutura de resposta consistente, facilitando o tratamento
//            de sucessos e erros.
// =================================================================================

/**
 * Envia uma resposta de sucesso padronizada.
 * @param {object} res - O objeto de resposta do Express.
 * @param {object} [options] - Opções para a resposta.
 * @param {number} [options.status=200] - O código de status HTTP.
 * @param {string} [options.message="Operação realizada com sucesso."] - A mensagem de sucesso.
 * @param {*} [options.data=null] - Os dados a serem enviados no corpo da resposta.
 */
export function successResponse(res, { status = 200, message = "Operação realizada com sucesso.", data = null } = {}) {
  return res.status(status).json({ success: true, message, data });
}

/**
 * Envia uma resposta de erro padronizada.
 * @param {object} res - O objeto de resposta do Express.
 * @param {object} [options] - Opções para a resposta.
 * @param {number} [options.status=400] - O código de status HTTP.
 * @param {string} [options.message="Ocorreram erros na requisição."] - A mensagem de erro principal.
 * @param {Array|object} [options.errors=null] - Um array ou objeto com detalhes específicos do erro (ex: erros de validação do Mongoose).
 */
export function errorResponse(res, { status = 400, message = "Ocorreram erros na requisição.", errors = null } = {}) {
  return res.status(status).json({ success: false, message, errors });
}
