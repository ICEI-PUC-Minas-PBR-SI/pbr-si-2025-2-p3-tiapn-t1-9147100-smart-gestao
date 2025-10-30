// =============================================
// utils/responseHelper.js
// Padroniza respostas da API em um formato simples e didático
// Formato:
//  Sucesso: { success: true, message, data }
//  Erro:    { success: false, message, errors }
// =============================================

export function successResponse(res, { status = 200, message = "Operação realizada com sucesso.", data = null } = {}) {
  return res.status(status).json({ success: true, message, data });
}

export function errorResponse(res, { status = 400, message = "Ocorreram erros na requisição.", errors = null } = {}) {
  return res.status(status).json({ success: false, message, errors });
}
