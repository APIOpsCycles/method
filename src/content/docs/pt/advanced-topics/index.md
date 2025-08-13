---
title: "Perguntas frequentes para usuários experientes do APIOps Cycles"
draft: false
---

Já está familiarizado com os [conceitos básicos do APIOps Cycles](../getting-started/)?

:::note

Esta página responde às perguntas mais comuns que recebemos de parceiros e clientes interessados em dimensionar a entrega de APIs, melhorar a governança ou adaptar o método para ambientes complexos.

:::

---

## 1. Por que a aposentadoria de APIs não é uma etapa do ciclo de vida no APIOps Cycles

Aqui está uma análise de como a aposentadoria de APIs se encaixa naturalmente nas estações existentes, com base nos princípios de gerenciamento de produtos e na experiência da “linha de frente”:

**1. Estação de estratégia de produto da API**

É aqui que as decisões sobre continuar, mudar ou aposentar uma API devem ser tomadas.

- O Customer Journey Canvas pode mostrar que uma jornada do usuário está obsoleta ou é tratada em outro lugar. É muito útil para verificar requisitos futuros com empresas que usam jornadas.
- O API Value Proposition Canvas pode sinalizar a diminuição do valor exclusivo. Esse canvas é frequentemente usado para mapear as necessidades dos usuários finais e desenvolvedores para APIs novas e existentes. Ele deve mostrar se uma API não é mais necessária ou requer uma reformulação extensa.
- O API Business Model Canvas pode revelar ROI negativo ou estruturas de custo insustentáveis. Este canvas final da estação API Product Strategy deve mostrar se os benefícios e os custos estão equilibrados e se há consumidores disponíveis para uma API.

→ A retirada é uma decisão de produto, não apenas um evento técnico.

**2. Estação de monitoramento e melhoria**

É aqui que devem surgir as evidências para a retirada e alimentar a API Product Strategy.
- Métricas de uso (tráfego em declínio, nenhuma chamada de segmentos importantes)
- Feedback do consumidor (pontuação em pesquisas, NPS, problemas no GitHub)
- Indicadores operacionais (relação custo/benefício, vulnerabilidades de segurança)

A falta de oportunidades de melhoria pode indicar que a API não justifica mais o investimento ou a continuidade.

→ Esta estação fornece a justificativa quantitativa e qualitativa para a aposentadoria.

**3. Estação de gerenciamento de lançamento**

É aqui que já existe a execução das diretrizes de descontinuação de versões e depreciação de APIs.
- Políticas de ciclo de vida da versão
- Planos de compatibilidade com versões anteriores
- Modelos de comunicação de descontinuação
- Redirecionamentos e planejamento de fallback

→ É aqui que você implementa os aspectos operacionais da aposentadoria de uma API.

---

## 2. Como posso integrar o APIOps Cycles ao nosso processo Agile ou SAFe?
Trate as estações como **oficinas ou etapas de refinamento do backlog** dentro do seu ritmo Agile.
- Use telas nos sprints iniciais para descoberta.
- Revisite estações como *Auditoria* e *Métricas e análises* regularmente como parte do seu ciclo de inspeção/adaptação.
- No SAFe, as estações se alinham bem com os Enabler Epics e a governança no nível do portfólio.

---

## 3. Qual é a melhor maneira de executar uma auditoria de API e com que frequência devo fazê-la?
No método APIOps Cycles, a estação API Audit corresponde às coisas normalmente verificadas durante uma API Desig Review ou qualquer ponto de verificação que você já tenha para garantir que a API está pronta para publicação para consumidores internos ou externos. Use a [API Audit Checklist](../resources/api-audit-checklist/) para isso, ela é dividida em três fases, dependendo do estado da API que está sendo revisada ou auditada.
 
Existe outro tipo de “auditoria”, uma *auditoria de capacidade da API*, da governança da API ou do programa da API, que você também pode fazer. A lista de verificação de auditoria da API pode ser usada e automatizada para determinar a integridade geral das APIs da sua organização. Isso se correlaciona com a mentalidade geral, a cultura e o estado de todo o seu programa de API. Mas, para aprofundar, você pode querer examinar mais detalhadamente o estado das estações suburbanas na Linha do Modelo Operacional e nas outras linhas, uma área de foco ou linha de cada vez. Nossos parceiros têm experiência em ajudar você a avaliar e elaborar planos de melhoria para expandir seus programas de API. 

**Frequência da auditoria de capacidade:** Trimestral para programas grandes, anual para equipes menores.
- Trate-a como uma revisão colaborativa, não como um exercício de conformidade.
- Vincule as descobertas aos itens de melhoria em seu backlog.

---

## 4. Como adapto o método para setores regulamentados (finanças, saúde, etc.)?
- Adicione pontos de verificação regulamentares nas estações relevantes (por exemplo, estação de arquitetura da plataforma API que usa os *Canvases de impacto nos negócios*, *Localização* e *Capacidade*).
- Inclua as partes interessadas em conformidade desde o início.
- Mantenha evidências das decisões nas exportações do canvas (JSON/SVG) para trilhas de auditoria. Isso é fácil de fazer usando o Canvas Creator para preencher, exportar e importar os canvases, para que você possa armazenar os canvases preenchidos por humanos e/ou IA no controle de versão.

---

## 5. Quais são as funções essenciais que devem estar envolvidas em cada estação ao dimensionar a entrega da API?
- *Estação de estratégia de produto API envolvendo, por exemplo, jornada do cliente/proposta de valor*: gerentes de produto, UX, gerentes de parceria, arquitetos, desenvolvedores líderes
- *Estação de design API com, por exemplo, design de domínio/interação*: gerentes de produto, arquitetos, desenvolvedores líderes
- *Arquitetura da plataforma API envolvendo impacto nos negócios/capacidade*: gerentes de produto, arquitetura, engenheiros de plataforma, segurança, líderes de governança
- *Métricas e análises*: equipes de dados/análises, engenheiros de plataforma, gerentes de produto, suporte de API

---

## 6. O APIOps Cycles pode ser usado apenas para APIs internas ou também para APIs de parceiros/públicas?

Ambos. Todas as estações, linhas, recursos e critérios se aplicam a ambos.
 
As diferenças serão evidentes “dentro” do trabalho relacionado à estação, ou seja, ao preencher o canvas da jornada do cliente, quem é o cliente, e ao preencher o canvas do modelo de negócios da API, quem são os consumidores da API.
Dica: mesmo ao planejar APIs internas, os clientes da jornada do cliente são provavelmente os “clientes reais” da sua organização, ou seja, externos. A história também prova que a maioria das APIs internas não permanece interna para sempre.

---

## 7. Como posso medir a maturidade do programa de API usando o APIOps Cycles?

Acompanhe:
- Cobertura da estação (quais estações são visitadas regularmente)
- Métricas de qualidade da estação *Métricas e análises*
- Adoção da governança a partir de resultados individuais da *Auditoria de API* ou de auditorias de capacidade.
- Adoção pelo consumidor (crescimento do uso, tempo de integração)

---

## 8. Como obtenho a adesão da diretoria para usar esse método em toda a organização?
- Use os canvases criados na estação Estratégia de Produto API, como *Customer Journey Canvas* e *API Business Model Canvas* para executivos de negócios. Meça os KPIs de negócios e a adoção na estação Monitoramento e Melhoria.
- Para líderes de tecnologia, use o quadro *Impacto nos negócios* da estação Arquitetura da plataforma API e os resultados da estação Auditoria de API em todas as APIs para mostrar o alinhamento com as metas estratégicas.
- Compartilhe visuais do mapa metropolitano do progresso e da maturidade ao longo do tempo.
- Enfatize a redução do risco de entrega e o tempo de lançamento no mercado mais rápido.

---

## 9. Posso pular certas estações permanentemente?

Você pode pular por enquanto, mas não para sempre.
Algumas estações (por exemplo, *Estratégia de Produto API, Auditoria API*, *Monitoramento e Melhoria)* podem parecer de baixa prioridade inicialmente, mas ignorá-las indefinidamente pode criar lacunas de governança e dívida técnica.
 
Como nossos parceiros do APIOps Cycles podem dizer por experiência com muitas organizações, a estação API Audit pode ser até mesmo a mais importante para começar, além da API Product Strategy (se houver muitas APIs novas ou aprimoradas planejadas ou grandes mudanças comerciais ou técnicas).

---

## 10. Como o método APIOps Cycles nos ajuda a criar ou melhorar nosso próprio modelo de governança de API?
O APIOps Cycles é o *sistema operacional* para sua governança. Ele transforma políticas de alto nível em artefatos concretos, rituais e verificações automatizadas dentro do ciclo de vida da API, para que a governança seja leve, iterativa e realmente utilizada.
Você pode usar e vincular as partes do método que se aplicam diretamente à sua organização e adicionar quaisquer requisitos ou documentos adicionais à sua própria documentação interna. Os **recursos do APIOps Cycles** incluem telas, diretrizes e exemplos de tipos de ferramentas que você pode adaptar ao seu modelo de governança. Além das telas, da **Lista de verificação de auditoria de API** e dos **Princípios de design de API**, a maioria dos recursos são “esboços” que indicam o que poderia ou deveria ser fornecido, em vez de diretrizes completas e prescritivas.

**Suas opções incluem:**
- **Usar como está**: vincule as partes relevantes do método diretamente nos seus documentos de governança.
- **Adaptar**: personalize telas, listas de verificação ou diretrizes para seus padrões internos.
- **Contribua**: sugira novas diretrizes ou recursos para inclusão no método APIOps Cycles, para que outros possam se beneficiar.

Você termina com um modelo de governança que combina **suas políticas internas** com **práticas APIOps Cycles testadas pela comunidade**, tornando mais fácil para as equipes seguirem e para os líderes aplicarem na entrega diária.