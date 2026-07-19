(() => {
  const CAP = 6000;
  const OUTBOUND_PAID = 580; // ~R$ 1.159,14 / 2 — já pago, fora do teto
  const RETURN_PAID = 589; // ~R$ 1.178,82 / 2 — já pago, fora do teto
  const TREK_QUOTE = 2100;
  const STORAGE_KEY = "lencois-jeri-dashboard-v2";

  // Âncoras públicas (sem códigos de reserva, documentos ou cartão)
  const FLIGHTS = {
    outbound: {
      date: "03/08/2026",
      weekday: "segunda",
      from: "POA",
      to: "SLZ",
      dep: "04:45",
      arr: "10:45",
      airline: "LATAM",
      notes: "1 conexão em Guarulhos · Economy Light",
    },
    inbound: {
      date: "13/08/2026",
      weekday: "quinta",
      from: "FOR",
      to: "POA",
      dep: "12:50",
      arr: "18:50",
      airline: "Azul",
      notes: "1 parada · econômica",
    },
  };

  const SCENARIO_META = {
    enxuto: {
      label: "Enxuto",
      transfers: 720,
      food: 480,
      tours: 180,
      extras: 180,
    },
    equilibrado: {
      label: "Equilibrado",
      transfers: 780,
      food: 620,
      tours: 300,
      extras: 280,
    },
    confortavel: {
      label: "Confortável",
      transfers: 1100,
      food: 900,
      tours: 550,
      extras: 450,
    },
  };

  const HOTEL_PP = {
    0: { enxuto: 120, equilibrado: 180, confortavel: 280 },
    2: { enxuto: 320, equilibrado: 520, confortavel: 900 },
    3: { enxuto: 420, equilibrado: 680, confortavel: 1200 },
    4: { enxuto: 520, equilibrado: 850, confortavel: 1500 },
  };

  // Variantes DENTRO da janela fixa 03–13/08
  const CALENDARS = {
    base: {
      title: "Roteiro base · 03–13/08/2026 · recomendado",
      rows: [
        [
          "03/08",
          "seg",
          "POA 04:45 → SLZ 10:45 (LATAM) · van → Barreirinhas (~4h)",
          "Barreirinhas",
        ],
        [
          "04/08",
          "ter",
          "DIA 0+1: lancha Rio Preguiças → Atins · início travessia → Baixa Grande",
          "Baixa Grande",
        ],
        ["05/08", "qua", "Travessia: Baixa Grande → Queimada dos Britos", "Queimada"],
        ["06/08", "qui", "Travessia: Queimada → Betânia (dia longo)", "Betânia"],
        [
          "07/08",
          "sex",
          "Travessia: Betânia → Santo Amaro · fim do trek",
          "Santo Amaro",
        ],
        [
          "08/08",
          "sáb",
          "Transfer Santo Amaro/Barreirinhas → Jericoacoara (7–9h)",
          "Jeri (noite)",
        ],
        ["09/08", "dom", "Descanso: duna do pôr do sol + vila", "Jeri"],
        ["10/08", "seg", "Lado Leste — Lagoa do Paraíso / Azul", "Jeri"],
        ["11/08", "ter", "Pedra Furada (maré baixa) ou Lado Oeste", "Jeri"],
        [
          "12/08",
          "qua",
          "Manhã livre em Jeri · transfer tarde → Fortaleza",
          "Fortaleza",
        ],
        [
          "13/08",
          "qui",
          "FOR 12:50 → POA 18:50 (Azul) · check-in cedo no aeroporto",
          "POA",
        ],
      ],
    },
    jeri_curta: {
      title: "Jeri curta · 03–13/08 · mais folga pós-trek",
      rows: [
        [
          "03/08",
          "seg",
          "POA 04:45 → SLZ 10:45 · van Barreirinhas",
          "Barreirinhas",
        ],
        [
          "04/08",
          "ter",
          "Buffer: ATM, mochila, Rio Preguiças / alinhar com guia",
          "Barreirinhas",
        ],
        [
          "05–08/08",
          "4d",
          "Travessia Atins → Santo Amaro (4 dias / 3 noites)",
          "Oásis",
        ],
        ["09/08", "dom", "Transfer → Jeri (dia inteiro)", "Jeri"],
        ["10/08", "seg", "Descanso + duna", "Jeri"],
        ["11/08", "ter", "Leste (Paraíso) — único buggy/jardineira", "Jeri"],
        [
          "12/08",
          "qua",
          "Pedra Furada / folga · transfer tarde → Fortaleza",
          "Fortaleza",
        ],
        ["13/08", "qui", "FOR 12:50 → POA 18:50", "POA"],
      ],
    },
    delta: {
      title: "Com Delta · 03–13/08 · apertado (corta Jeri)",
      rows: [
        [
          "03/08",
          "seg",
          "POA 04:45 → SLZ 10:45 · van Barreirinhas",
          "Barreirinhas",
        ],
        [
          "04–07/08",
          "4d",
          "Travessia Atins → Santo Amaro",
          "Oásis",
        ],
        [
          "08/08",
          "sáb",
          "Santo Amaro → Parnaíba / Delta do Parnaíba",
          "Parnaíba",
        ],
        [
          "09/08",
          "dom",
          "Delta / revoada · transfer → Jeri",
          "Jeri",
        ],
        ["10/08", "seg", "Descanso + duna", "Jeri"],
        ["11/08", "ter", "Leste (Paraíso)", "Jeri"],
        [
          "12/08",
          "qua",
          "Saída Jeri → Fortaleza (não deixar para o dia 13)",
          "Fortaleza",
        ],
        ["13/08", "qui", "FOR 12:50 → POA 18:50", "POA"],
      ],
    },
  };

  const TABS = [
    { id: "visao", label: "Visão geral" },
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
    trek: "#0a5554",
    transfers: "#3ecfc4",
    hotels: "#b8956a",
    food: "#d9c4a0",
    tours: "#5aa9a6",
    extras: "#8aa8a5",
  };

  const DEFAULT_CHECKS = {
    chkTrek: false,
    chkPerguntas: false,
    chkTransferJeri: false,
    chkHotelJeri: false,
    chkFor13: false,
    chkTpa: false,
    chkSeguro: false,
    chkCash: false,
    chkFlights: true,
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
    const transfers = s.transfers + (jeriNights === 0 ? -200 : 0);
    const food = s.food + (jeriNights === 0 ? -200 : jeriNights === 4 ? 120 : 0);
    const items = {
      trek,
      transfers,
      hotels,
      food,
      tours,
      extras: s.extras,
    };
    const total = Object.values(items).reduce((a, b) => a + b, 0);
    return { items, total, remaining: CAP - total, trek };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
          .map((cell, ci) => {
            const cls = aligns[ci] === "right" ? ' class="num"' : "";
            return `<td${cls}>${cell}</td>`;
          })
          .join("");
        return `<tr class="${tone.trim()}">${cells}</tr>`;
      })
      .join("");
    return `<div class="scroll-table"><table class="data"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function renderStats(budget) {
    const over = budget.remaining < 0;
    const tight = !over && budget.remaining < 300;
    const tone = over ? "alert" : tight ? "warn" : "ok";
    els.stats.innerHTML = `
      <div class="stat stat--${tone}">
        <div class="stat__value">${money(budget.total)}</div>
        <div class="stat__label">Gasto restante / pessoa · ${SCENARIO_META[state.scenario].label}</div>
      </div>
      <div class="stat stat--${tone}">
        <div class="stat__value">${money(Math.abs(budget.remaining))}</div>
        <div class="stat__label">${over ? "Acima do teto" : "Folga no teto"}</div>
      </div>
      <div class="stat">
        <div class="stat__value">${money(budget.trek)}</div>
        <div class="stat__label">Travessia no cenário</div>
      </div>
      <div class="stat stat--info">
        <div class="stat__value">03→13/08</div>
        <div class="stat__label">Janela fixa · ${state.jeriNights} noites Jeri</div>
      </div>
    `;
  }

  function renderUsage(budget) {
    const pct = Math.min(100, Math.round((budget.total / CAP) * 100));
    const segs = [
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
        <span>${pct}% do teto R$ 6.000 (sem aviões)</span>
        <span>${money(budget.total)} / ${money(CAP)}</span>
      </div>
      <div class="usage__track">${bars}</div>
      <div class="usage__legend">${legend}</div>
      <p class="muted" style="margin:0.75rem 0 0">
        Ida LATAM (~${money(OUTBOUND_PAID)}/pess.) e volta Azul (~${money(RETURN_PAID)}/pess.) já pagas — fora do teto.
      </p>
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
        return `
          <div class="chart-bars__row">
            <div>${label}</div>
            <div class="chart-bars__track chart-bars__cap">
              <div class="chart-bars__fill" style="width:${w}%"></div>
            </div>
            <div class="num">${money(totals[i])}</div>
          </div>`;
      })
      .join("");

    return `
      <section class="section is-active" data-section="visao">
        <h2>Âncoras fixas — não mudar</h2>
        <p class="lede">Toda a logística e a travessia encaixam entre estes dois voos já comprados.</p>
        ${table(
          ["Trecho", "Data", "Horários", "Cia", "Status"],
          [
            [
              "Ida POA → SLZ",
              "03/08 (seg)",
              "04:45 → 10:45",
              "LATAM",
              "Pago · fixo",
            ],
            [
              "Volta FOR → POA",
              "13/08 (qui)",
              "12:50 → 18:50",
              "Azul",
              "Pago · fixo",
            ],
          ],
          { tones: ["ok", "ok"] }
        )}
        <p class="muted">Códigos de reserva, documentos e cartão ficam só no e-mail/app — não nesta página.</p>

        <div class="grid-2" style="margin-top:1rem">
          <div class="block">
            <div class="block__title">Já fechado <span class="tag tag--ok">âncora</span></div>
            <ul>
              <li>Ida LATAM 03/08 · chega SLZ 10:45 (conexão GRU)</li>
              <li>Volta Azul 13/08 · sai FOR 12:50</li>
              <li>Cotação travessia ${money(TREK_QUOTE)}/pessoa</li>
            </ul>
          </div>
          <div class="block">
            <div class="block__title">Próximas travas <span class="tag tag--warn">urgente</span></div>
            <ol>
              <li>Confirmar datas da travessia com o guia (início 04/08)</li>
              <li>Van SLZ→Barreirinhas no dia 03 (após 10:45)</li>
              <li>Transfer pós-trek → Jeri (08/08 no roteiro base)</li>
              <li>Noite em Fortaleza 12/08 OU privativo madrugada 13/08</li>
            </ol>
          </div>
        </div>

        <h3>Matriz Jeri vs teto (dentro de 03–13/08)</h3>
        ${table(
          ["Opção", "Noites", "Fit no teto", "Experiência"],
          [
            ["Pular Jeri", "0", "Folgado", "Só Lençóis + saída FOR"],
            ["Jeri curta", "2", "Seguro no Enxuto", "Duna + 1 lado lagoas"],
            ["Jeri equilíbrio", "3", "Melhor fit Equilibrado", "Roteiro base"],
            ["Jeri cheia", "4", "Apertado", "Só se cortar extras"],
          ],
          { tones: ["", "info", "ok", "warn"] }
        )}
        <h3>Comparativo de cenários (resto da viagem / pessoa)</h3>
        <div class="chart-bars">${bars}</div>
        <p class="muted">Aviões já pagos fora da conta. Cenário atual: ${money(budget.total)} de ${money(CAP)}.</p>
        <div class="alert alert--info">
          <strong>Veredito</strong>
          Com ida e volta fixas, o perfil Equilibrado + roteiro base (3 noites Jeri + noite FOR em 12/08) é o mais seguro. Chegada em SLZ às 10:45 no dia 03 permite van no mesmo dia para Barreirinhas.
        </div>
      </section>`;
  }

  function sectionCalendario() {
    const cal = CALENDARS[state.plan] || CALENDARS.base;
    return `
      <section class="section is-active" data-section="calendario">
        <h2>${cal.title}</h2>
        <p class="lede">Janela travada: chega 03/08 10:45 em SLZ · sai 13/08 12:50 de FOR. Troque só a variante do plano nos controles.</p>
        ${table(["Data", "Dia", "Plano", "Pernoite"], cal.rows)}
        <div class="grid-3">
          <div class="block">
            <div class="block__title">Roteiro base</div>
            <p>Trek 04–07 · Jeri 08–11 · FOR 12 · voo 13. Melhor equilíbrio descanso + lagoas.</p>
          </div>
          <div class="block">
            <div class="block__title">Jeri curta</div>
            <p>1 dia buffer em Barreirinhas (04/08) · trek 05–08 · Jeri mais curta. Menos pressa no início.</p>
          </div>
          <div class="block">
            <div class="block__title">+ Delta</div>
            <p>Inclui Parnaíba — corta noites em Jeri. Só se o Delta for prioridade.</p>
          </div>
        </div>
      </section>`;
  }

  function sectionTravessia() {
    return `
      <section class="section is-active" data-section="travessia">
        <h2>Travessia 4 dias (encaixe 04–07/08)</h2>
        <p class="lede">Pacote tipo Walter: Atins → Santo Amaro. Precisa começar logo após a chegada do dia 03 — alinhar datas com o guia agora.</p>
        <h3>Dia a dia (referência do guia)</h3>
        ${table(
          ["Dia", "Rota", "km / ritmo", "Pernoite"],
          [
            ["0+1 · 04/08", "Barreirinhas → lancha → Atins → Baixa Grande", "lancha + ~13 km", "Baixa Grande"],
            ["2 · 05/08", "Baixa Grande → Queimada dos Britos", "~10 km", "Queimada"],
            ["3 · 06/08", "Queimada → Betânia", "~17 km (longo)", "Betânia"],
            ["4 · 07/08", "Betânia → Santo Amaro", "~10 km", "Santo Amaro"],
          ]
        )}
        <div class="alert alert--warn">
          <strong>Perguntas ao guia (R$ 2.100)</strong>
          Consegue iniciar 04/08 de manhã (vocês chegam SLZ 03/08 10:45)? Transfer Santo Amaro incluso no dia 07 ou 08? Lancha + 4×4? Refeições/água? Grupo mínimo? Condutor ICMBio? Onde deixa mala grande?
        </div>
        <div class="grid-2">
          <div class="block">
            <div class="block__title">Geralmente incluso</div>
            <ul>
              <li>Guia local credenciado</li>
              <li>3 noites redário + refeições nos oásis</li>
              <li>4×4 internos da trilha</li>
            </ul>
          </div>
          <div class="block">
            <div class="block__title">Fora do pacote (confirmar)</div>
            <ul>
              <li>Van SLZ ↔ Barreirinhas / Santo Amaro</li>
              <li>Lancha Barreirinhas → Atins (DIA 0)</li>
              <li>Água engarrafada / bebidas</li>
            </ul>
          </div>
        </div>
      </section>`;
  }

  function sectionLogistica() {
    return `
      <section class="section is-active" data-section="logistica">
        <h2>Logística — horários fixos</h2>
        <h3>1. Ida (já comprada)</h3>
        ${table(
          ["Item", "Detalhe"],
          [
            ["Data", "segunda 03/08/2026"],
            ["Partida", "POA 04:45"],
            ["Chegada", "SLZ 10:45"],
            ["Cia", "LATAM · 1 conexão Guarulhos"],
            ["Tarifa", "Economy Light · já paga"],
            ["Próximo passo", "Van compartilhada SLZ → Barreirinhas (~4h) no mesmo dia"],
          ]
        )}
        <h3>2. São Luís → Barreirinhas (03/08)</h3>
        ${table(
          ["Modal", "Duração", "Preço/pess.", "Notas"],
          [
            ["Van compartilhada", "3h30–4h30", "R$ 100–160", "Embarque aeroporto após 10:45"],
            ["Ônibus", "4h30–5h", "R$ 70–75", "Checar horário compatível"],
            ["Privativo", "~4h", "mais caro", "Só se perder a van"],
          ],
          { aligns: ["left", "left", "right", "left"] }
        )}
        <h3>3. Lençóis → Jericoacoara</h3>
        ${table(
          ["Opção", "Duração", "Preço", "Encaixe"],
          [
            ["Van compartilhada", "7–9h", "R$ 460–650", "Roteiro base: 08/08"],
            ["Santo Amaro → Jeri", "~9h", "~R$ 750", "Se terminarem o trek em SA"],
            ["Via Delta", "+1–2 dias", "+R$ 160–170/trecho", "Variante Delta"],
          ],
          { tones: ["ok", "info", "warn"], aligns: ["left", "left", "right", "left"] }
        )}
        <h3>4. Volta (já comprada) — crítico</h3>
        ${table(
          ["Opção", "Saída Jeri", "Chegada FOR", "Serve 12:50?", "Preço"],
          [
            ["Compartilhado regular", "~10:30", "~18:00", "Não", "R$ 100–300"],
            ["Privativo 4×4", "~4h–5h30 dia 13", "4,5–6h depois", "Sim", "R$ 700–900/carro"],
            ["Pernoite Fortaleza 12/08", "tarde do dia 12", "noite 12", "Sim (recomendado)", "+ hotel"],
          ],
          { tones: ["alert", "ok", "ok"] }
        )}
        <div class="alert alert--danger">
          <strong>13/08 12:50 é inalterável</strong>
          Não contem com van compartilhada no dia do voo. Travar agora: noite em Fortaleza em 12/08 (preferível) ou privativo de madrugada.
        </div>
      </section>`;
  }

  function sectionJeri() {
    return `
      <section class="section is-active" data-section="jeri">
        <h2>Jericoacoara (após o trek)</h2>
        <div class="alert alert--info">
          <strong>“Rota Romântica”</strong>
          Peçam Lado Leste / Lagoa do Paraíso. A Rota Romântica oficial é do RS; aqui o circuito é lagoas + Rota das Emoções.
        </div>
        ${table(
          ["Passeio", "Conteúdo", "Compartilhado", "Buggy privativo"],
          [
            ["Litoral Leste", "Paraíso, Azul, Buraco Azul, Preá", "R$ 140–240 casal", "R$ 360–600/buggy"],
            ["Litoral Oeste", "Guriú, Tatajuba, Mangue Seco", "R$ 140–260 casal", "R$ 380–550/buggy"],
            ["Pedra Furada", "A pé na maré baixa", "Grátis", "opcional"],
            ["Duna do Pôr do Sol", "Ritual diário", "Grátis", "—"],
          ],
          { aligns: ["left", "left", "right", "right"] }
        )}
        <p class="muted">TTS 2026: R$ 41,50/pessoa — canal oficial ADEJERI. 1º dia em Jeri = só descanso (vocês chegam de transfer longo).</p>
        <h3>No roteiro base (chegada 08/08)</h3>
        ${table(
          ["Dia", "Plano"],
          [
            ["08/08", "Chegada à noite — sem passeio"],
            ["09/08", "Descanso + duna"],
            ["10/08", "Leste (Paraíso)"],
            ["11/08", "Pedra Furada ou Oeste"],
            ["12/08", "Manhã livre · sair à tarde para FOR"],
          ]
        )}
      </section>`;
  }

  function sectionOrcamento(budget) {
    const rows = [
      ["Travessia", budget.items.trek],
      ["Transfers", budget.items.transfers],
      ["Hotéis fora da trilha", budget.items.hotels],
      ["Comida (fora da trilha)", budget.items.food],
      ["Passeios Jeri + TTS", budget.items.tours],
      ["Seguro / chip / extras", budget.items.extras],
    ];
    const tableRows = rows.map(([label, value]) => [
      label,
      money(value),
      `${Math.round((value / CAP) * 100)}%`,
    ]);
    tableRows.push(["TOTAL restante", money(budget.total), `${Math.round((budget.total / CAP) * 100)}%`]);

    let acc = 0;
    const pieParts = rows.map(([label, value], i) => {
      const pct = (value / budget.total) * 100;
      acc += pct;
      return { label, value, pct, color: Object.values(SEG_COLORS)[i] };
    });
    const gradient = pieParts
      .map((p, i) => {
        const end = pieParts.slice(0, i + 1).reduce((a, x) => a + x.pct, 0);
        const start = end - p.pct;
        return `${p.color} ${start}% ${end}%`;
      })
      .join(", ");

    return `
      <section class="section is-active" data-section="orcamento">
        <h2>Orçamento — ${SCENARIO_META[state.scenario].label}</h2>
        <p class="lede">Teto ${money(CAP)}/pessoa para o que ainda falta. Ida e volta aéreas já pagas (fora do teto).</p>
        ${table(
          ["Já pago (fora do teto)", "≈ / pessoa"],
          [
            ["Ida LATAM POA→SLZ", money(OUTBOUND_PAID)],
            ["Volta Azul FOR→POA", money(RETURN_PAID)],
          ],
          { aligns: ["left", "right"] }
        )}
        <div class="grid-2">
          <div>
            ${table(["Ainda gastar", "R$/pessoa", "% do teto"], tableRows, {
              aligns: ["left", "right", "right"],
              tones: Array(rows.length).fill("").concat([budget.remaining < 0 ? "alert" : "ok"]),
            })}
            <p class="muted">Casal (×2): ~${money(budget.total * 2)} restantes. Folga: ${money(budget.remaining)}/pess.</p>
          </div>
          <div class="block">
            <div class="block__title">Composição do restante</div>
            <div class="pie-wrap">
              <div class="pie" style="background:conic-gradient(${gradient})" data-center="${money(budget.total)}"></div>
            </div>
          </div>
        </div>
      </section>`;
  }

  function sectionPrazos() {
    return `
      <section class="section is-active" data-section="prazos">
        <h2>Prazos (voos já ok)</h2>
        <p class="lede">Ida 03/08 e volta 13/08 estão compradas. O relógio agora é da travessia e dos transfers.</p>
        ${table(
          ["#", "O quê", "Quando", "Por quê"],
          [
            ["1", "Confirmar travessia com guia (início 04/08)", "Imediato", "Janela curta até 03/08"],
            ["2", "Van SLZ→Barreirinhas dia 03 após 10:45", "Esta semana", "Chegada fixa"],
            ["3", "Transfer pós-trek → Jeri", "Com fim do trek definido", "Frequência limitada"],
            ["4", "Pousada Jeri + hotel FOR 12/08", "Já apertado", "Alta temporada"],
            ["5", "Plano Jeri→FOR (noite FOR ou privativo)", "2–4 semanas", "Voo 12:50 inalterável"],
            ["6", "TTS + seguro + chip + buggy", "1–2 semanas", "TTS online ADEJERI"],
          ]
        )}
      </section>`;
  }

  function sectionChecklist() {
    const items = [
      ["chkFlights", "Ida LATAM 03/08 e volta Azul 13/08 — vouchers salvos no celular"],
      ["chkTrek", "Travessia confirmada por escrito (início compatível com 04/08)"],
      ["chkPerguntas", "Inclusões da cotação R$ 2.100 respondidas"],
      ["chkTransferJeri", "Transfer Lençóis→Jeri reservado"],
      ["chkHotelJeri", "Pousada Jeri + hotel Fortaleza 12/08"],
      ["chkFor13", "Plano FOR do dia 13 travado (não usar van 10h30)"],
      ["chkTpa", "TTS Jeri no canal oficial"],
      ["chkSeguro", "Seguro com cobertura de trekking"],
      ["chkCash", "Saque em SLZ/Barreirinhas (~R$ 800–1.500 casal)"],
    ];
    const checks = items
      .map(([id, label]) => {
        const on = state.checks[id];
        return `
          <label class="check${on ? " is-on" : ""}">
            <input type="checkbox" data-check="${id}" ${on ? "checked" : ""} />
            <span>${label}</span>
          </label>`;
      })
      .join("");

    return `
      <section class="section is-active" data-section="checklist">
        <h2>Checklist operacional</h2>
        <p class="lede">Salva neste navegador. Não cole códigos de reserva nem documentos nas notas públicas.</p>
        <div class="block">
          <div class="block__title">Reservas</div>
          <div class="check-list">${checks}</div>
        </div>
        <h3>Notas (só neste aparelho)</h3>
        <div class="block">
          <textarea class="notes" id="notesField" placeholder="WhatsApp do guia, horários de van… (não cole códigos de reserva nem documentos)"></textarea>
          <div style="display:flex;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap">
            <button type="button" class="btn btn--soft btn--sm" id="stampNotes">Carimbar data</button>
            <button type="button" class="btn btn--soft btn--sm" id="clearNotes">Limpar notas</button>
          </div>
        </div>
      </section>`;
  }

  function sectionDicas() {
    return `
      <section class="section is-active" data-section="dicas">
        <h2>Dicas práticas</h2>
        <div class="grid-2">
          <div class="block">
            <div class="block__title">Dia 03/08 — chegada cedo</div>
            <ul>
              <li>POA 04:45: sair de casa na madrugada</li>
              <li>SLZ 10:45 → van Barreirinhas no mesmo dia</li>
              <li>Sacar dinheiro em SLZ ou Barreirinhas</li>
              <li>Organizar mochila na noite do dia 03</li>
            </ul>
          </div>
          <div class="block">
            <div class="block__title">Dia 13/08 — saída</div>
            <ul>
              <li>Dormir em Fortaleza no dia 12</li>
              <li>Não usar transfer compartilhado da manhã do 13</li>
              <li>Check-in Azul com folga</li>
            </ul>
          </div>
        </div>
        <h3>Dinheiro e sinal</h3>
        ${table(
          ["Local", "ATM", "PIX", "Sinal"],
          [
            ["São Luís / aeroporto", "Sim", "Sim", "OK"],
            ["Barreirinhas", "Sim (último confiável)", "Sim", "OK"],
            ["Oásis / Atins", "Não", "Instável", "Quase zero nas dunas"],
            ["Jeri", "Não na vila", "Amplo", "Melhorou"],
          ]
        )}
        <div class="pill-row" style="margin-top:1rem">
          <span class="pill">RG/CNH</span>
          <span class="pill">Vouchers ida+volta no offline</span>
          <span class="pill">Confirmação trek</span>
          <span class="pill">Chip Vivo</span>
        </div>
      </section>`;
  }

  function renderContent(budget) {
    const map = {
      visao: () => sectionVisao(budget),
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
      const stamp = `[${new Date().toLocaleDateString("pt-BR")}] `;
      state.notes = (state.notes ? state.notes + "\n" : "") + stamp;
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
    els.footerStatus.textContent = `03–13/08 fixo · ${SCENARIO_META[state.scenario].label} · plano ${state.plan} · Jeri ${state.jeriNights}n · trek ${money(budget.trek)}`;
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
    document.getElementById("conteudo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.resetBtn.addEventListener("click", () => {
    state.scenario = "equilibrado";
    state.plan = "base";
    state.jeriNights = "3";
    state.trekMode = "cotacao";
    state.tab = "visao";
    render();
    document.getElementById("painel")?.scrollIntoView({ behavior: "smooth" });
  });

  render();
})();
