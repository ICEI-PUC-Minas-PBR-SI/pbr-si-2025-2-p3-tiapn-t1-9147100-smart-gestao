const TestSequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends TestSequencer {
  sort(tests) {
    // Define a ordem desejada dos diretórios de teste (por prefixo)
    const orderedPrefixes = [
      `${process.cwd().replace(/\\/g, '/')}/Testes/1-auth`,
      `${process.cwd().replace(/\\/g, '/')}/Testes/2-features`,
      `${process.cwd().replace(/\\/g, '/')}/Testes/3-security`,
      `${process.cwd().replace(/\\/g, '/')}/Testes/4-reports`,
    ];

    return Array.from(tests).sort((a, b) => {
      const ap = orderedPrefixes.findIndex(p => a.path.startsWith(p));
      const bp = orderedPrefixes.findIndex(p => b.path.startsWith(p));
      const ai = ap === -1 ? Number.MAX_SAFE_INTEGER : ap;
      const bi = bp === -1 ? Number.MAX_SAFE_INTEGER : bp;
      if (ai !== bi) return ai - bi;
      // fallback para a ordenação padrão
      return a.path.localeCompare(b.path);
    });
  }
}

module.exports = CustomSequencer;
