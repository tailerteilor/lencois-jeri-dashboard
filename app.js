(() => {
  const CAP = 6000;
  const OUTBOUND_PAID = 580; // ~R$ 1.159,14 / 2
  const RETURN_PAID = 589; // ~R$ 1.178,82 / 2
  const TREK_QUOTE = 2100;
  const STORAGE_KEY = "lencois-jeri-dashboard-v3";

  const SCENARIO_META = {
    enxuto: {
      label: "Enxuto",
      why: "Prioriza vans compartilhadas, 1 passeio em Jeri, pousada simples. Folga para imprevistos (van atrasada, privativo no dia 13).",
      transfers: 700,
      food: 450,
      tours: 160,
      extras: 160,
    },
    equilibrado: {
      label: "Equilibrado",
      why: "Melhor custo-benefício: vans ok, 3 noites Jeri, 1 buggy/jardineira Leste, noite em Fortaleza no dia 12 (seguro para o voo). Cabe no teto com os aviões inclusos.",
      transfers: 820,
      food: 580,
      tours: 280,
      extras: 250,
    },
    confortavel: {
      label: "Confortável",
      why: "Mais privativo, 2 passeios em Jeri, pousada melhor. Com aviões + trek R$ 2.100, tende a passar de R$ 6.000 — só se cortarem Jeri ou o valor do trek.",
      transfers: 1100,
      food: 850,
      tours: 520,
      extras: 400,
    },
  };

  const HOTEL_PP = {
    0: { enxuto: 150, equilibrado: 220, confortavel: 320 },
    2: { enxuto: 350, equilibrado: 520, confortavel: 900 },
    3: { enxuto: 450, equilibrado: 680, confortavel: 1200 },
    4: { enxuto: 550, equilibrado: 850, confortavel: 1500 },
  };

  const CALENDARS = {
    base: {
      title: "Roteiro base · 03–13/08/2026 · melhor encaixe de horários",
      why: "Respeita a lancha das ~12:30 para Atins (só no dia 04), o transfer compartilhado Barreirinhas→Jeri nas ter/qui/sáb (08/08 é sábado) e a obrigação de estar em FOR cedo no dia 13.",
      rows: [
        [
          "03/08",
          "seg",
          "POA 04:45 → SLZ 10:45 · van ~12:30 ou 15:00 → Barreirinhas",
          "Barreirinhas",
        ],
        [
          "04/08",
          "ter",
          "Lancha ~12:30 → Atins · início travessia à tarde → Baixa Grande",
          "Baixa Grande",
        ],
        ["05/08", "qua", "Travessia → Queimada dos Britos", "Queimada"],
        ["06/08", "qui", "Travessia → Betânia (dia mais longo)", "Betânia"],
        ["07/08", "sex", "Travessia → Santo Amaro · fim do trek", "Santo Amaro"],
        [
          "08/08",
          "sáb",
          "Transfer SA/Barreirinhas → Jeri (Rota Combo: sábados)",
          "Jeri",
        ],
        ["09/08", "dom", "Descanso obrigatório · duna do pôr do sol", "Jeri"],
        ["10/08", "seg", "Lado Leste — Lagoa do Paraíso (prioridade)", "Jeri"],
        ["11/08", "ter", "Pedra Furada (maré baixa) ou Lado Oeste", "Jeri"],
        [
          "12/08",
          "qua",
          "Manhã em Jeri · transfer tarde → Fortaleza",
          "Fortaleza",
        ],
        ["13/08", "qui", "FOR 12:50 → POA 18:50", "POA"],
      ],
    },
    jeri_curta: {
      title: "Buffer em Barreirinhas · 03–13/08",
      why: "Se o guia não puder começar a travessia no dia 04 à tarde, usam o dia 04 só para lancha/Atins ou descanso e deslocam o trek para 05–08. O transfer para Jeri passa a ser domingo 09/08 — aí compartilhado Rota Combo NÃO roda (só seg/qua/sex no sentido inverso e ter/qui/sáb no sentido Lençóis→Jeri). Nesse caso precisariam de privativo ou outra operadora no domingo.",
      rows: [
        [
          "03/08",
          "seg",
          "POA→SLZ 10:45 · van → Barreirinhas",
          "Barreirinhas",
        ],
        [
          "04/08",
          "ter",
          "Folga / ATM / alinhar guia · lancha 12:30 → Atins (opcional)",
          "Barreirinhas ou Atins",
        ],
        ["05–08/08", "4d", "Travessia Atins → Santo Amaro", "Oásis"],
        [
          "09/08",
          "dom",
          "Transfer → Jeri (preferir privativo: domingo fora da malha ter/qui/sáb)",
          "Jeri",
        ],
        ["10–11/08", "2d", "Descanso + Leste", "Jeri"],
        ["12/08", "qua", "Transfer → Fortaleza", "Fortaleza"],
        ["13/08", "qui", "FOR 12:50 → POA", "POA"],
      ],
    },
    delta: {
      title: "Com Delta do Parnaíba · 03–13/08",
      why: "Inclui Parnaíba/Delta entre o trek e Jeri. Consome 1–2 dias — sobra menos Jeri. Só vale se o Delta for prioridade emocional; senão o roteiro base entrega mais lagoas + vila.",
      rows: [
        ["03/08", "seg", "POA→SLZ · van Barreirinhas", "Barreirinhas"],
        ["04–07/08", "4d", "Travessia → Santo Amaro", "Oásis"],
        ["08/08", "sáb", "SA → Parnaíba / Delta", "Parnaíba"],
        ["09/08", "dom", "Delta · transfer → Jeri", "Jeri"],
        ["10–11/08", "2d", "Jeri concentrada", "Jeri"],
        ["12/08", "qua", "→ Fortaleza", "Fortaleza"],
        ["13/08", "qui", "FOR 12:50 → POA", "POA"],
      ],
    },
  };

  const TABS = [
    { id: "visao", label: "Visão geral" },
    { id: "viabilidade", label: "Viabilidade" },
    { id: "calendario", label: "Calendário" },
    { id: "travessia", label: "Travessia" },
    { id: "logistica", label: "Logística" },
    { id: "jeri", label: "Jericoacoara" },
    { id: "orcamento", label: "Orçamento" },
    { id: "prazos", label: "Prazos" },
    { id: "checklist", label: "Checklist" },
    { id: "dicas", label: "Dicas" },
  ];

  const SEG_COLORS = {
    outbound: "#0a5554",
    inbound: "#0e8a86",
    trek: "#3ecfc4",
    transfers: "#b8956a",
    hotels: "#d9c4a0",
    food: "#5aa9a6",
    tours: "#7eb8b5",
    extras: "#8aa8a5",
  };

  const DEFAULT_CHECKS = {
    chkFlights: true,
    chkTrek: false,
    chkPerguntas: false,
    chkVan03: false,
    chkLancha04: false,
    chkTransferJeri: false,
    chkHotelJeri: false,
    chkFor12: false,
    chkTpa: false,
    chkSeguro: false,
    chkCash: false,
  };

  function money(n) {
    return `R$ ${Math.round(n).toLocaleString("pt-BR")}`;
  }

  function budgetFor(scenario, jeriNights, trekMode) {
    const s = SCENARIO_META[scenario];
    const trek =
      trekMode === "cotacao" ? TREK_QUOTE : trekMode === "grupo_barato" ? 1580 : 3700;
    const hotels = HOTEL_PP[jeriNights][scenario];
    const jeriAdj =
      jeriNights === 0 ? -s.tours : jeriNights === 2 ? -40 : jeriNights === 4 ? 80 : 0;
    const tours = Math.max(0, s.tours + jeriAdj);
    const transfers = s.transfers + (jeriNights === 0 ? -180 : 0);
    const food = s.food + (jeriNights === 0 ? -180 : jeriNights === 4 ? 100 : 0);
    const items = {
      outbound: OUTBOUND_PAID,
      inbound: RETURN_PAID,
      trek,
      transfers,
      hotels,
      food,
      tours,
      extras: s.extras,
    };
    const total = Object.values(items).reduce((a, b) => a + b, 0);
    return { items, total, remaining: CAP - total, trek, why: s.why };
  }

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  }

  function saveState(st) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(st));
  }

  const saved = loadState();
  const state = {
    scenario: saved?.scenario || "equilibrado",
    plan: saved?.plan || "base",
    jeriNights: String(saved?.jeriNights ?? "3"),
    trekMode: saved?.trekMode || "cotacao",
    tab: saved?.tab || "visao",
    notes: saved?.notes || "",
    checks: { ...DEFAULT_CHECKS, ...(saved?.checks || {}) },
  };

  const els = {
    scenario: document.getElementById("scenario"),
    plan: document.getElementById("plan"),
    jeriNights: document.getElementById("jeriNights"),
    trekMode: document.getElementById("trekMode"),
    stats: document.getElementById("stats"),
    usage: document.getElementById("usage"),
    tabs: document.getElementById("tabs"),
    conteudo: document.getElementById("conteudo"),
    footerStatus: document.getElementById("footerStatus"),
    resetBtn: document.getElementById("resetBtn"),
  };

  function persist() {
    saveState(state);
  }

  function syncControls() {
    els.scenario.value = state.scenario;
    els.plan.value = state.plan;
    els.jeriNights.value = state.jeriNights;
    els.trekMode.value = state.trekMode;
  }

  function table(headers, rows, options = {}) {
    const tones = options.tones || [];
    const aligns = options.aligns || [];
    const head = headers
      .map((h, i) => `<th class="${aligns[i] === "right" ? "num" : ""}">${h}</th>`)
      .join("");
    const body = rows
      .map((row, ri) => {
        const tone = tones[ri] ? ` tone-${tones[ri]}` : "";
        const cells = row
          .map(
            (cell, ci) =>
              `<td class="${aligns[ci] === "right" ? "num" : ""}">${cell}</td>`
          )
          .join("");
        return `<tr class="${tone.trim()}">${cells}</tr>`;
      })
      .join("");
    return `<div class="scroll-table"><table class="data"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function explain(title, html) {
    return `<div class="alert alert--info" style="margin:1rem 0"><strong>${title}</strong>${html}</div>`;
  }

  function renderStats(budget) {
    const over = budget.remaining < 0;
    const tight = !over && budget.remaining < 250;
    const tone = over ? "alert" : tight ? "warn" : "ok";
    els.stats.innerHTML = `
      <div class="stat stat--${tone}">
        <div class="stat__value">${money(budget.total)}</div>
        <div class="stat__label">Total / pessoa · ${SCENARIO_META[state.scenario].label} (com aviões)</div>
      </div>
      <div class="stat stat--${tone}">
        <div class="stat__value">${money(Math.abs(budget.remaining))}</div>
        <div class="stat__label">${over ? "Acima do teto R$ 6.000" : "Folga no teto"}</div>
      </div>
      <div class="stat">
        <div class="stat__value">${money(OUTBOUND_PAID + RETURN_PAID)}</div>
        <div class="stat__label">Soma dos 2 voos já pagos / pessoa</div>
      </div>
      <div class="stat stat--info">
        <div class="stat__value">03→13/08</div>
        <div class="stat__label">11 dias · voos fixos</div>
      </div>
    `;
  }

  function renderUsage(budget) {
    const pct = Math.min(100, Math.round((budget.total / CAP) * 100));
    const segs = [
      ["outbound", "Ida LATAM"],
      ["inbound", "Volta Azul"],
      ["trek", "Travessia"],
      ["transfers", "Transfers"],
      ["hotels", "Hotéis"],
      ["food", "Comida"],
      ["tours", "Jeri"],
      ["extras", "Extras"],
    ];
    const bars = segs
      .map(([id]) => {
        const w = Math.max(0, (budget.items[id] / CAP) * 100);
        return `<div class="usage__seg" style="width:${w}%;background:${SEG_COLORS[id]}"></div>`;
      })
      .join("");
    const legend = segs
      .map(
        ([id, label]) =>
          `<span><i style="background:${SEG_COLORS[id]}"></i>${label} ${money(budget.items[id])}</span>`
      )
      .join("");
    els.usage.innerHTML = `
      <div class="usage__head">
        <span>${pct}% do teto R$ 6.000 · aviões inclusos</span>
        <span>${money(budget.total)} / ${money(CAP)}</span>
      </div>
      <div class="usage__track">${bars}</div>
      <div class="usage__legend">${legend}</div>
      <p class="muted" style="margin:0.75rem 0 0">${budget.why}</p>
    `;
  }

  function renderTabs() {
    els.tabs.innerHTML = TABS.map(
      (t) =>
        `<button type="button" class="tab${state.tab === t.id ? " is-active" : ""}" data-tab="${t.id}">${t.label}</button>`
    ).join("");
  }

  function sectionVisao(budget) {
    const totals = ["enxuto", "equilibrado", "confortavel"].map((s) =>
      budgetFor(s, Number(state.jeriNights), state.trekMode).total
    );
    const bars = ["Enxuto", "Equilibrado", "Confortável"]
      .map((label, i) => {
        const w = Math.min(100, (totals[i] / CAP) * 100);
        return `<div class="chart-bars__row"><div>${label}</div><div class="chart-bars__track chart-bars__cap"><div class="chart-bars__fill" style="width:${w}%"></div></div><div class="num">${money(totals[i])}</div></div>`;
      })
      .join("");

    return `
      <section class="section is-active" data-section="visao">
        <h2>O que está decidido e por quê</h2>
        <p class="lede">Este painel não escolhe datas de voo — elas já existem. O trabalho é encaixar terra, trilha e Jeri sem mentir sobre horários de lancha, van e transfer.</p>

        ${table(
          ["Trecho", "Data / horários", "Já pago ≈", "Entra no teto?"],
          [
            ["Ida POA → SLZ (LATAM, 1 conexão GRU)", "03/08 · 04:45 → 10:45", money(OUTBOUND_PAID) + "/pess.", "Sim"],
            ["Volta FOR → POA (Azul, 1 parada)", "13/08 · 12:50 → 18:50", money(RETURN_PAID) + "/pess.", "Sim"],
            ["Travessia 4 dias (cotação)", "Ideal 04–07/08", money(TREK_QUOTE) + "/pess.", "Sim"],
          ],
          { tones: ["ok", "ok", "info"], aligns: ["left", "left", "right", "left"] }
        )}
        <p class="muted">Códigos de reserva, documentos e cartão ficam só no e-mail/app — nunca neste site público.</p>

        ${explain(
          "Por que o teto agora inclui os aviões",
          " Vocês pediram explicitamente: o limite de R$ 6.000/pessoa precisa contar ida + volta já pagas. Isso muda o jogo — sobra menos para trek + Jeri. No cenário Equilibrado ainda fecha, mas Confortável com 4 noites em Jeri quase certamente estoura."
        )}

        <div class="grid-2">
          <div class="block">
            <div class="block__title">Decisões já tomadas</div>
            <ul>
              <li>Voos ida e volta comprados e inalteráveis</li>
              <li>Travessia a pé (não só jeep de lagoas)</li>
              <li>Parada em Jericoacoara depois dos Lençóis</li>
              <li>Volta por Fortaleza (não por São Luís)</li>
            </ul>
          </div>
          <div class="block">
            <div class="block__title">O que ainda escolher</div>
            <ul>
              <li>Confirmar com o guia o início em 04/08 à tarde</li>
              <li>Van do aeroporto SLZ no dia 03 (12:30 vs 15:00)</li>
              <li>Transfer sábado 08/08 → Jeri (malha ter/qui/sáb)</li>
              <li>Noite em Fortaleza 12/08 ( fortmente recomendada )</li>
            </ul>
          </div>
        </div>

        <h3>Três cenários de gasto (total com aviões)</h3>
        <div class="chart-bars">${bars}</div>
        <p class="muted">Linha mental do gráfico = teto R$ 6.000. Atual: ${money(budget.total)} · folga ${money(budget.remaining)}.</p>

        ${explain(
          "Veredito",
          " Usem o <b>roteiro base</b> + cenário <b>Equilibrado</b> + <b>3 noites em Jeri</b> + <b>noite em Fortaleza no dia 12</b>. É o único combo que respeita lancha, transfer de sábado e voo das 12:50 sem heroísmo de madrugada desnecessário."
        )}
      </section>`;
  }

  function sectionViabilidade() {
    return `
      <section class="section is-active" data-section="viabilidade">
        <h2>Viabilidade — horários que podem quebrar o roteiro</h2>
        <p class="lede">Pesquisa de mercado jul/2026 (Kairós, Rota Combo, Explore Atins, Enjoy Maranhão, RTUR). Confirmem 48h antes: maré, feriado e alta temporada mudam grade.</p>

        <h3>1. Dia 03/08 — chegada SLZ 10:45 → Barreirinhas</h3>
        ${table(
          ["Opção", "Horário típico", "Chegada estimada BRR", "Serve?"],
          [
            ["Van compartilhada", "Saída ~12:30 (embarque aeroporto após hotéis)", "~16:30–17:00", "Sim — alvo principal"],
            ["Van tarde", "Saída ~15:00–17:30", "~19:00–22:00", "Sim — plano B se perderem a 12:30"],
            ["Van manhã 08:00", "Já saiu", "—", "Não — vocês ainda estão no ar"],
            ["Ir direto a Atins no dia 03", "Lancha coletiva ~12:30 em Barreirinhas", "Impossível: van chega depois", "Não"],
          ],
          { tones: ["ok", "info", "alert", "alert"] }
        )}
        ${explain(
          "Por que dormem em Barreirinhas no dia 03",
          " A lancha coletiva Barreirinhas→Atins sai por volta das <b>12:30</b> (e às vezes ~16:00 sazonal/privativo). Mesmo pegando a van das 12:30 em SLZ, vocês só chegam em Barreirinhas no fim da tarde — <b>depois</b> da lancha do dia. Forçar Atins no dia 03 exigiria lancha/4×4 privativo caro e corrida sem margem. A escolha correta é: van → noite Barreirinhas → lancha 12:30 do dia 04."
        )}

        <h3>2. Dia 04/08 — lancha para Atins (gargalo real)</h3>
        ${table(
          ["Modal", "Saída Barreirinhas", "Duração", "Observação"],
          [
            ["Lancha direta (coletiva)", "~12:30", "~1–1h30", "Padrão — reservar"],
            ["Lancha/passeio com paradas", "~08:30–09:00", "~4h (Chega ~13:30)", "Vassouras, Mandacaru, Caburé"],
            ["Lancha ~16:00", "Sazonal / às vezes só privativo", "~1h", "Confirmar na semana"],
            ["4×4 pela praia", "Depende da maré baixa", "~1h30", "Horário muda todo dia"],
          ],
          { tones: ["ok", "info", "warn", "warn"] }
        )}
        ${explain(
          "Por que a travessia começa à tarde do dia 04",
          " O pacote do guia (Walter) prevê lancha Barreirinhas→Atins (DIA 0, muitas vezes fora do pacote) e caminhada Atins→Baixa Grande no mesmo dia se chegarem cedo o bastante. Com a coletiva das 12:30, chegam em Atins ~14:00 — dá para iniciar a trilha à tarde (ele mesmo descreve essa opção) ou pernoitar em Atins e sair de madrugada no dia 05. <b>Confirmem com o Walter qual das duas ele prefere para o grupo de vocês.</b>"
        )}

        <h3>3. Transfer Lençóis → Jeri (malha semanal)</h3>
        ${table(
          ["Operador / tipo", "Dias", "Saída", "Implicação para vocês"],
          [
            ["Rota Combo compartilhado BRR→Jeri", "Terça, quinta, sábado", "~9h–10h", "08/08 é sábado — encaixa no roteiro base"],
            ["Rota Combo sentido Jeri→BRR", "Segunda, quarta, sexta", "~9h", "Não é o sentido de vocês"],
            ["Privativo (RTUR, G.i Conect…)", "Todos os dias", "A combinar", "Plano B se mudarem o fim do trek"],
            ["Santo Amaro → Jeri", "Sob consulta", "~9h de estrada", "Se terminarem em SA na sex 07/08"],
          ],
          { tones: ["ok", "neutral", "info", "info"] }
        )}
        ${explain(
          "Por que o fim do trek é sexta 07/08 e o transfer é sábado 08/08",
          " Se terminarem a travessia na sexta em Santo Amaro, dormem lá (ou voltam a Barreirinhas) e pegam o compartilhado de <b>sábado</b> — dia em que a Rota Combo opera BRR→Jeri. Se o trek escorregar para sábado, o próximo compartilhado pode ser só terça — perdendo 2 noites de Jeri ou pagando privativo (~R$ 1.650–2.000/carro)."
        )}

        <h3>4. Dia 13/08 — voo FOR 12:50</h3>
        ${table(
          ["Opção", "Funciona?", "Por quê"],
          [
            ["Van compartilhada saindo Jeri ~10:30", "Não", "Chega FOR ~18h — voo já foi embora"],
            ["Privativo saindo Jeri ~4h–5h30 do dia 13", "Sim", "4,5–6h de estrada; chegar ~10h no aeroporto"],
            ["Dormir Fortaleza na noite de 12/08", "Sim — recomendado", "Zero estresse; check-in tranquilo"],
          ],
          { tones: ["alert", "ok", "ok"] }
        )}
        ${explain(
          "Por que empurramos a saída de Jeri para a tarde do dia 12",
          " O voo das 12:50 é inalterável. Privativo de madrugada funciona, mas depois de 4 dias de areia + dias de Jeri é cruel. Uma diária em Fortaleza (~R$ 150–300 o quarto) é o seguro de viagem mais barato que vocês vão comprar."
        )}

        <h3>Mapa de risco (resumo)</h3>
        ${table(
          ["Risco", "Probabilidade", "Mitigação"],
          [
            ["Perder van 12:30 em SLZ no dia 03", "Média (desembarque + bagagem)", "Ter WhatsApp da van 15:00/17:30 já salvo"],
            ["Guia não iniciar trek dia 04 tarde", "Média", "Perguntar agora; plano B = buffer (variante Jeri curta)"],
            ["Trek atrasar e perder sábado→Jeri", "Baixa–média", "Privativo ou aceitar chegar Jeri terça"],
            ["Contar com van Jeri→FOR no dia 13", "Erro certo", "Proibido no plano — hotel FOR dia 12"],
            ["Lancha 12:30 lotada em agosto", "Média", "Reservar com antecedência / guia resolve"],
          ],
          { tones: ["warn", "warn", "warn", "alert", "info"] }
        )}
      </section>`;
  }

  function sectionCalendario() {
    const cal = CALENDARS[state.plan] || CALENDARS.base;
    return `
      <section class="section is-active" data-section="calendario">
        <h2>${cal.title}</h2>
        <p class="lede">${cal.why}</p>
        ${table(["Data", "Dia", "Plano", "Pernoite"], cal.rows)}
        <div class="grid-3">
          <div class="block">
            <div class="block__title">Base (recomendado)</div>
            <p>Respeita lancha 12:30, transfer sábado e noite em FOR. Máximo de Jeri útil sem quebrar malha.</p>
          </div>
          <div class="block">
            <div class="block__title">Buffer Barreirinhas</div>
            <p>Se o guia pedir folga no dia 04. Cuidado: transfer no domingo pode exigir privativo.</p>
          </div>
          <div class="block">
            <div class="block__title">+ Delta</div>
            <p>Bonito, mas come Jeri. Só se o Delta for desejo forte do casal.</p>
          </div>
        </div>
      </section>`;
  }

  function sectionTravessia() {
    return `
      <section class="section is-active" data-section="travessia">
        <h2>Travessia — o coração da viagem</h2>
        <p class="lede">Cotação R$ 2.100/pessoa. Rota clássica Atins → Santo Amaro (a favor do vento). Nível moderado, saídas de madrugada, redário nos oásis.</p>

        ${explain(
          "Por que travessia e não só jeep",
          " Jeep de Barreirinhas (Azul/Bonita) vê a borda do parque. A travessia cruza o miolo — lagoas sem plateia, noites em comunidade. Vocês já orçaram isso; repetir jeep depois seria gastar duas vezes pela mesma ideia."
        )}

        <h3>Roteiro alinhado aos voos (guia tipo Walter)</h3>
        ${table(
          ["Quando", "Trecho", "O que acontece", "Nota"],
          [
            ["04/08 tarde", "Atins → Baixa Grande", "4×4 até bandeira + ~13 km a pé", "Depois da lancha 12:30"],
            ["05/08", "Baixa Grande → Queimada", "~10 km", "Banho + pôr do sol"],
            ["06/08", "Queimada → Betânia", "~17 km — dia duro", "Saída ~4h"],
            ["07/08", "Betânia → Santo Amaro", "~10 km", "Fim · transfer SA→BRR/Jeri dia seguinte"],
          ]
        )}

        <h3>O que costuma estar incluso × fora</h3>
        <div class="grid-2">
          <div class="block">
            <div class="block__title">Incluso (pedir por escrito)</div>
            <ul>
              <li>Guia credenciado ICMBio</li>
              <li>3 noites redário</li>
              <li>Café, almoço, jantar nos oásis</li>
              <li>4×4 internos da trilha</li>
            </ul>
          </div>
          <div class="block">
            <div class="block__title">Geralmente fora</div>
            <ul>
              <li>Van SLZ ↔ Barreirinhas / Santo Amaro</li>
              <li>Lancha Barreirinhas → Atins (DIA 0)</li>
              <li>Água engarrafada / bebidas</li>
              <li>Transfer para Jeri</li>
            </ul>
          </div>
        </div>

        ${explain(
          "Perguntas obrigatórias ao guia agora",
          " 1) Consegue iniciar 04/08 após a lancha das 12:30? 2) Lancha está no pacote ou à parte? 3) Onde deixa a mala grande? 4) No dia 07 terminam em Santo Amaro a que horas — dá para ir a Barreirinhas no mesmo dia? 5) Grupo mínimo / saída garantida a 2? 6) Sinal, cancelamento, seguro?"
        )}

        <h3>Faixa de mercado (para comparar a cotação)</h3>
        ${table(
          ["Tipo", "Faixa", "Leitura"],
          [
            ["Grupo econômico", "~R$ 1.580–1.750", "Mais barato; datas fixas / mínimo de pessoas"],
            ["Cotação de vocês", "R$ 2.100", "Média-baixa — ótima se transfers internos estiverem claros"],
            ["Pacote completo c/ SLZ", "~R$ 3.200–4.400", "Inclui vans; caro para o teto com aviões"],
          ],
          { tones: ["info", "ok", "warn"] }
        )}
      </section>`;
  }

  function sectionLogistica() {
    return `
      <section class="section is-active" data-section="logistica">
        <h2>Logística completa com motivos</h2>

        <h3>Voos (fixos, no teto)</h3>
        ${table(
          ["", "Ida", "Volta"],
          [
            ["Data", "03/08/2026 (segunda)", "13/08/2026 (quinta)"],
            ["Horário", "POA 04:45 → SLZ 10:45", "FOR 12:50 → POA 18:50"],
            ["Cia", "LATAM (conexão GRU)", "Azul (1 parada)"],
            ["≈ / pessoa já pago", money(OUTBOUND_PAID), money(RETURN_PAID)],
          ]
        )}

        <h3>SLZ → Barreirinhas (03/08)</h3>
        <p class="muted">Fontes: Kairós Tur, Guia de Barreirinhas — saídas típicas 4h / 8h / 12:30 / 15h–17:30. Embarque no aeroporto costuma ser o último ponto.</p>
        ${table(
          ["Horário van", "Por que usar / não usar"],
          [
            ["12:30", "Alvo: chegam 10:45, dá tempo se desembarque for rápido. Reservem e avisem atraso."],
            ["15:00–17:30", "Plano B seguro se a conexão GRU atrasar ou a fila do aeroporto engasgar."],
            ["08:00", "Inútil — vocês ainda estão voando."],
          ],
          { tones: ["ok", "info", "alert"] }
        )}

        <h3>Barreirinhas → Atins (04/08)</h3>
        ${table(
          ["Horário", "Tipo", "Decisão"],
          [
            ["~12:30", "Lancha coletiva direta", "Escolha padrão do roteiro base"],
            ["~08:30", "Lancha com paradas (passeio)", "Só se estiverem em BRR na manhã e quiserem o passeio"],
            ["~16:00", "Sazonal/privativo", "Confirmar; não contar como certo"],
          ]
        )}

        <h3>Lençóis → Jeri</h3>
        ${table(
          ["Opção", "Quando roda", "Preço aprox.", "Nosso uso"],
          [
            ["Rota Combo compartilhado", "Ter / qui / sáb ~9–10h", "R$ 460–650/pess.", "Sábado 08/08"],
            ["Privativo 4×4", "Qualquer dia", "R$ 1.650–2.000/carro", "Plano B"],
            ["Santo Amaro → Jeri", "Sob consulta", "~R$ 750/pess. ou priv.", "Se ficarem em SA na sex"],
          ],
          { aligns: ["left", "left", "right", "left"], tones: ["ok", "info", "info"] }
        )}

        <h3>Jeri → Fortaleza (antes do voo)</h3>
        ${table(
          ["Opção", "Serve o voo 12:50?", "Motivo / custo"],
          [
            ["Compartilhado ~10:30", "Não", "Chega ~18h"],
            ["Privativo madrugada dia 13", "Sim", "R$ 700–900/carro · cansativo"],
            ["Hotel FOR noite 12/08 + táxi/Uber aeroporto", "Sim — preferido", "Diária + paz"],
          ],
          { tones: ["alert", "ok", "ok"] }
        )}
      </section>`;
  }

  function sectionJeri() {
    return `
      <section class="section is-active" data-section="jeri">
        <h2>Jericoacoara — recompensa pós-trilha</h2>
        ${explain(
          "Por que Jeri depois (e não antes)",
          " Lençóis exige corpo e madrugada. Jeri é vila, rede, pôr do sol e comida — contraste emocional. Fazer o contrário terminaria a viagem no esforço máximo."
        )}
        ${explain(
          "Sobre “Rota Romântica”",
          " A Rota Romântica oficial é no Rio Grande do Sul. Em Jeri o que vocês querem chamar assim é o <b>Lado Leste</b> (Lagoa do Paraíso, Azul, Buraco Azul) — o circuito mais “de casal”. A <b>Rota das Emoções</b> é o corredor MA–PI–CE (Lençóis → Delta → Jeri)."
        )}

        <h3>Passeios e por que priorizar o Leste</h3>
        ${table(
          ["Passeio", "Para 2 (aprox.)", "Por que sim / não"],
          [
            ["Leste compartilhado", "R$ 140–240", "Prioridade: Paraíso é o cartão-postal; cabe no orçamento"],
            ["Oeste compartilhado", "R$ 140–260", "Adrenalina (balsa, Tatajuba); 2º dia se sobrar energia"],
            ["Buggy privativo", "R$ 360–600/buggy", "Romântico, mas come o teto — só se sobrar folga"],
            ["Pedra Furada a pé", "Grátis", "Maré baixa; combinar horário no dia"],
            ["Duna pôr do sol", "Grátis", "Todo dia; chegar 40–60 min antes"],
          ],
          { aligns: ["left", "right", "left"] }
        )}
        <p class="muted">TTS municipal 2026: R$ 41,50/pessoa — pagar só no canal oficial ADEJERI.</p>

        <h3>Roteiro Jeri no plano base (chegada sábado 08/08 à noite)</h3>
        ${table(
          ["Dia", "Plano", "Motivo"],
          [
            ["08/08", "Só chegar e dormir", "7–9h de estrada após 4 dias de trek"],
            ["09/08", "Descanso + duna", "Corpo recupera; experiência icônica grátis"],
            ["10/08", "Leste / Paraíso", "Melhor dia de lagoa com energia"],
            ["11/08", "Pedra Furada ou Oeste", "Flexível conforme maré/vontade"],
            ["12/08", "Manhã livre → FOR à tarde", "Proteger o voo do dia 13"],
          ]
        )}
      </section>`;
  }

  function sectionOrcamento(budget) {
    const rows = [
      ["Ida LATAM (já paga)", budget.items.outbound],
      ["Volta Azul (já paga)", budget.items.inbound],
      ["Travessia", budget.items.trek],
      ["Transfers (vans, Jeri, FOR)", budget.items.transfers],
      ["Hotéis fora da trilha", budget.items.hotels],
      ["Comida fora da trilha", budget.items.food],
      ["Passeios Jeri + TTS", budget.items.tours],
      ["Seguro / chip / extras", budget.items.extras],
    ];
    const tableRows = rows.map(([label, value]) => [
      label,
      money(value),
      `${Math.round((value / CAP) * 100)}%`,
    ]);
    tableRows.push([
      "TOTAL no teto",
      money(budget.total),
      `${Math.round((budget.total / CAP) * 100)}%`,
    ]);

    const pieParts = rows.map(([label, value], i) => ({
      label,
      value,
      pct: (value / budget.total) * 100,
      color: Object.values(SEG_COLORS)[i],
    }));
    const gradient = pieParts
      .map((p, i) => {
        const end = pieParts.slice(0, i + 1).reduce((a, x) => a + x.pct, 0);
        const start = end - p.pct;
        return `${p.color} ${start}% ${end}%`;
      })
      .join(", ");

    return `
      <section class="section is-active" data-section="orcamento">
        <h2>Orçamento com aviões dentro do teto</h2>
        <p class="lede">Teto ${money(CAP)}/pessoa. Ida (~${money(OUTBOUND_PAID)}) + volta (~${money(RETURN_PAID)}) + resto. ${budget.why}</p>

        ${explain(
          "Como ler estes números",
          " Valores de terra são <b>estimativas de mercado</b> (jul/2026). Os voos são o que vocês já pagaram, rateados por pessoa. Se o guia incluir lancha/vans, a linha de transfers cai — peçam o breakdown."
        )}

        <div class="grid-2">
          <div>
            ${table(["Item", "R$/pessoa", "% teto"], tableRows, {
              aligns: ["left", "right", "right"],
              tones: Array(rows.length)
                .fill("")
                .concat([budget.remaining < 0 ? "alert" : "ok"]),
            })}
            <p class="muted">Casal (×2): ~${money(budget.total * 2)}. Folga individual: ${money(budget.remaining)}.</p>
          </div>
          <div class="block">
            <div class="block__title">Composição do teto</div>
            <div class="pie-wrap">
              <div class="pie" style="background:conic-gradient(${gradient})" data-center="${money(budget.total)}"></div>
            </div>
            <p class="muted">Quase 40% do teto já está nos dois voos + a travessia. Jeri e conforto disputam o resto.</p>
          </div>
        </div>

        <h3>Onde o teto estoura com mais facilidade</h3>
        <div class="tip-grid">
          <div>Buggy privativo em vez de jardineira</div>
          <div>Transfer Lençóis→Jeri privativo fora do sábado</div>
          <div>4+ noites Jeri + beach clubs</div>
          <div>Esquecer a noite em FOR e pagar urgência</div>
          <div>Pacote trek “completo” R$ 3.700+ com aviões</div>
          <div>Cash-back caro em Jeri (sacar antes)</div>
        </div>
      </section>`;
  }

  function sectionPrazos() {
    return `
      <section class="section is-active" data-section="prazos">
        <h2>Ordem de ação (voos já ok)</h2>
        <p class="lede">Hoje → 03/08 são ~duas semanas. O que não estiver reservado vira estresse caro.</p>
        ${table(
          ["#", "Ação", "Prazo", "Por quê agora"],
          [
            ["1", "Confirmar trek com guia (início 04/08 após lancha 12:30)", "Hoje/amanhã", "Agosto lota oásis; precisa casar com lancha"],
            ["2", "Reservar van SLZ→BRR dia 03 (12:30 + plano B 15:00)", "Esta semana", "Chegada 10:45 é justa"],
            ["3", "Reservar lancha 12:30 do dia 04 (ou pedir ao guia)", "Com o trek", "Horário único confiável"],
            ["4", "Transfer sábado 08/08 → Jeri (Rota Combo / similar)", "Assim que o fim do trek estiver ok", "Malha ter/qui/sáb"],
            ["5", "Pousada Jeri + hotel Fortaleza 12/08", "Já", "Alta temporada"],
            ["6", "TTS + seguro trekking + chip Vivo", "1–2 semanas", "TTS só canal oficial"],
          ]
        )}
      </section>`;
  }

  function sectionChecklist() {
    const items = [
      ["chkFlights", "Vouchers ida LATAM 03/08 e volta Azul 13/08 salvos offline"],
      ["chkTrek", "Travessia confirmada por escrito (datas 04–07/08 + inclusões)"],
      ["chkPerguntas", "Guia respondeu: lancha, mala, horário fim em Santo Amaro, grupo mínimo"],
      ["chkVan03", "Van SLZ→Barreirinhas dia 03 reservada (12:30 e/ou 15:00)"],
      ["chkLancha04", "Lancha ~12:30 do dia 04 resolvida (guia ou bilhete)"],
      ["chkTransferJeri", "Transfer sábado 08/08 → Jeri reservado"],
      ["chkHotelJeri", "Pousada Jeri ok"],
      ["chkFor12", "Hotel Fortaleza 12/08 ok (ou privativo madrugada 13 combinado)"],
      ["chkTpa", "TTS Jeri no canal oficial"],
      ["chkSeguro", "Seguro com trekking/aventura"],
      ["chkCash", "Plano de saque SLZ/Barreirinhas"],
    ];
    const checks = items
      .map(([id, label]) => {
        const on = !!state.checks[id];
        return `<label class="check${on ? " is-on" : ""}"><input type="checkbox" data-check="${id}" ${on ? "checked" : ""} /><span>${label}</span></label>`;
      })
      .join("");

    return `
      <section class="section is-active" data-section="checklist">
        <h2>Checklist (salva neste navegador)</h2>
        <p class="lede">Não cole códigos de reserva, documentos ou dados de cartão nas notas.</p>
        <div class="block"><div class="block__title">Itens</div><div class="check-list">${checks}</div></div>
        <h3>Notas locais</h3>
        <div class="block">
          <textarea class="notes" id="notesField" placeholder="WhatsApp guia, confirmação de van…"></textarea>
          <div style="display:flex;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap">
            <button type="button" class="btn btn--soft btn--sm" id="stampNotes">Carimbar data</button>
            <button type="button" class="btn btn--soft btn--sm" id="clearNotes">Limpar</button>
          </div>
        </div>
      </section>`;
  }

  function sectionDicas() {
    return `
      <section class="section is-active" data-section="dicas">
        <h2>Dicas operacionais</h2>
        <div class="grid-2">
          <div class="block">
            <div class="block__title">Dia 03 — madrugada em POA</div>
            <ul>
              <li>Voo 04:45: estar no aeroporto ~02:45–03:00</li>
              <li>Conexão GRU curta (06:30→07:20) — não demorar no desembarque</li>
              <li>Em SLZ: já ter WhatsApp da van</li>
              <li>Sacar dinheiro antes de Atins/Jeri</li>
            </ul>
          </div>
          <div class="block">
            <div class="block__title">Na trilha</div>
            <ul>
              <li>Mochila 30–40 L, meia/papete, UV, headlamp</li>
              <li>Água se compra nos oásis (leve espécie)</li>
              <li>Tampão de ouvido no redário</li>
              <li>Não esperem sinal de celular nas dunas</li>
            </ul>
          </div>
        </div>
        <h3>ATM e PIX</h3>
        ${table(
          ["Local", "ATM", "PIX", "Nota"],
          [
            ["SLZ aeroporto", "Sim", "Sim", "Saque estratégico"],
            ["Barreirinhas", "Sim", "Sim", "Último ATM confiável"],
            ["Atins / oásis", "Não", "Instável", "Espécie"],
            ["Jeri", "Não na vila", "Amplo", "Cash-back caro"],
          ]
        )}
        <p class="muted" style="margin-top:1.25rem">Fontes de horário: Kairós Tur, Guia de Barreirinhas, Explore Atins, Enjoy Maranhão, Rota Combo, RTUR — consultar de novo na semana da viagem.</p>
      </section>`;
  }

  function renderContent(budget) {
    const map = {
      visao: () => sectionVisao(budget),
      viabilidade: sectionViabilidade,
      calendario: sectionCalendario,
      travessia: sectionTravessia,
      logistica: sectionLogistica,
      jeri: sectionJeri,
      orcamento: () => sectionOrcamento(budget),
      prazos: sectionPrazos,
      checklist: sectionChecklist,
      dicas: sectionDicas,
    };
    els.conteudo.innerHTML = (map[state.tab] || map.visao)();
    bindSectionEvents();
  }

  function bindSectionEvents() {
    els.conteudo.querySelectorAll("[data-check]").forEach((input) => {
      input.addEventListener("change", () => {
        state.checks[input.dataset.check] = input.checked;
        persist();
        input.closest(".check")?.classList.toggle("is-on", input.checked);
      });
    });
    const notes = document.getElementById("notesField");
    if (notes) {
      notes.value = state.notes;
      notes.addEventListener("input", () => {
        state.notes = notes.value;
        persist();
      });
    }
    document.getElementById("stampNotes")?.addEventListener("click", () => {
      state.notes =
        (state.notes ? state.notes + "\n" : "") +
        `[${new Date().toLocaleDateString("pt-BR")}] `;
      persist();
      render();
    });
    document.getElementById("clearNotes")?.addEventListener("click", () => {
      state.notes = "";
      persist();
      render();
    });
  }

  function renderFooter(budget) {
    els.footerStatus.textContent = `Teto c/ aviões ${money(budget.total)}/${money(CAP)} · ${SCENARIO_META[state.scenario].label} · plano ${state.plan}`;
  }

  function render() {
    const budget = budgetFor(
      state.scenario,
      Number(state.jeriNights),
      state.trekMode
    );
    syncControls();
    renderStats(budget);
    renderUsage(budget);
    renderTabs();
    renderContent(budget);
    renderFooter(budget);
    persist();
  }

  ["scenario", "plan", "jeriNights", "trekMode"].forEach((key) => {
    els[key].addEventListener("change", () => {
      state[key] = els[key].value;
      render();
    });
  });

  els.tabs.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tab]");
    if (!btn) return;
    state.tab = btn.dataset.tab;
    render();
    document
      .getElementById("conteudo")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.resetBtn.addEventListener("click", () => {
    Object.assign(state, {
      scenario: "equilibrado",
      plan: "base",
      jeriNights: "3",
      trekMode: "cotacao",
      tab: "visao",
    });
    render();
    document.getElementById("painel")?.scrollIntoView({ behavior: "smooth" });
  });

  render();
})();
