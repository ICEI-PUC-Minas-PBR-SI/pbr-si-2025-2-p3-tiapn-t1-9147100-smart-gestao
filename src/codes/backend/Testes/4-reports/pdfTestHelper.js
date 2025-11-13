/**
 * @file Helper para testes de PDF.
 * @description Encapsula a lógica de parsing de PDF para isolar os testes
 *              da complexidade de importação de módulos CJS em um ambiente ESM.
 */
import { createRequire } from 'module';

// Usa createRequire para carregar o módulo 'pdf-parse' de forma confiável.
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

export async function parsePdfBuffer(pdfBuffer) {
  return await pdf(pdfBuffer);
}