# 📊 Pasta `coverage` - Relatórios de Cobertura de Testes

Esta pasta **não faz parte do código-fonte** da aplicação. Ela é gerada automaticamente por ferramentas de teste (neste projeto, o **Jest**) quando a suíte de testes automatizados é executada com a opção de cobertura.

## O que é Cobertura de Código (Code Coverage)?

Cobertura de código é uma métrica que mede a porcentagem do seu código-fonte que foi executada durante a execução dos testes automatizados. O objetivo principal é identificar partes do código que **não estão sendo testadas**.

Um relatório de cobertura responde a perguntas como:
- "Quais arquivos têm menos testes?"
- "Esta nova função que criei está sendo testada?"
- "Existem condições (`if`/`else`) ou blocos `catch` que nunca são executados pelos testes?"

## Como Interpretar o Relatório?

O arquivo mais importante dentro desta pasta é o relatório interativo em HTML:

`lcov-report/index.html`

Ao abrir este arquivo em um navegador, você verá uma análise detalhada de cada arquivo do projeto:

-   **Linhas Verdes**: Indicam que o código naquela linha foi executado por um ou mais testes.
-   **Linhas Vermelhas**: Indicam que o código naquela linha **nunca foi executado** por nenhum teste. Estes são os "pontos cegos" que precisam de atenção.
-   **Marcadores Amarelos**: Indicam que uma estrutura de decisão (como um `if`/`else`) foi apenas parcialmente testada (por exemplo, o teste só cobriu o caminho do `if`, mas não o do `else`).

## Por que esta Pasta é Importante?

1.  **Aumenta a Qualidade do Código**: Ajuda a identificar falhas na suíte de testes, incentivando a criação de testes mais completos e, consequentemente, um software mais robusto e confiável.
2.  **Reduz Riscos**: Código não testado é uma fonte comum de bugs em produção. O relatório de cobertura expõe essas áreas de risco.
3.  **Facilita a Manutenção e Refatoração**: Uma alta cobertura de testes dá à equipe a confiança necessária para fazer alterações e melhorias no código, sabendo que os testes existentes podem detectar regressões (quebras de funcionalidades existentes) rapidamente.

## Geração e Versionamento

-   **Geração**: Este relatório é gerado ao executar o comando de teste com a flag de cobertura (ex: `npm test -- --coverage`).
-   **Versionamento**: Esta pasta **não deve ser versionada** no Git. Ela é um artefato de build e deve ser adicionada ao arquivo `.gitignore` para evitar que seus conteúdos sejam enviados para o repositório.
