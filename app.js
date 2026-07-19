(() => {
  const CAP = 6000;
  const RETURN_PAID = 589;
  const TREK_QUOTE = 2100;
  const STORAGE_KEY = "lencois-jeri-dashboard-v1";

  const SCENARIO_META = {
    enxuto: {
      label: "Enxuto",
      outbound: 1050,
      transfers: 720,
      food: 480,
      tours: 180,
      extras: 180,
    },
    equilibrado: {
      label: "Equilibrado",
      outbound: 1180,
      transfers: 780,
      food: 620,
      tours: 300,
      extras: 280,
    },
    confortavel: {
      label: "Confortável",
      outbound: 1450,
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

  const CALENDARS = {
    10: {
      title: "10 dias · 04–13/08/2026 · apertado",
      rows: [
        ["04/08", "seg", "POA → SLZ (manhã) → van Barreirinhas", "Noite Barreirinhas"],
        ["05–08/08", "4d", "Travessia Atins → Santo Amaro", "Redário oásis"],
        ["09/08", "sáb", "Transfer Santo Amaro/Barreirinhas → Jeri (7–9h)", "Chegada Jeri noite"],
        ["10–11/08", "2d", "Jeri: Leste (Paraíso) + duna / Pedra Furada", "2 noites Jeri"],
        ["12/08", "qua", "Folga leve OU transfer tarde → Fortaleza", "Jeri ou FOR"],
        ["13/08", "qui", "Privativo madrugada (se Jeri) → FOR → voo 12:50", "POA"],
      ],
    },
    12: {
      title: "12 dias · 02–13/08/2026 · recomendado",
      rows: [
        ["02/08", "dom", "POA → SLZ → van Barreirinhas", "Noite Barreirinhas"],
        ["03/08", "seg", "Buffer: Rio Preguiças / organizar mochila / ATM", "Barreirinhas"],
        ["04–07/08", "4d", "Travessia 4 dias (1ª quinzena = lagoas melhores)", "Oásis"],
        ["08/08", "sáb", "Transfer → Jeri (Rota das Emoções)", "Chegada cansada"],
        ["09/08", "dom", "Descanso: duna pôr do sol + vila", "Jeri"],
        ["10/08", "seg", "Buggy/jardineira Leste (Paraíso / Azul)", "Jeri"],
        ["11/08", "ter", "Oeste (Tatajuba) OU Pedra Furada + Preá", "Jeri"],
        ["12/08", "qua", "Última manhã Jeri → transfer tarde FOR", "Noite Fortaleza"],
        ["13/08", "qui", "Aeroporto FOR · check-in · voo 12:50", "POA 18:50"],
      ],
    },
    14: {
      title: "14 dias · 31/07–13/08/2026 · completo + Delta",
      rows: [
        ["31/07", "sex", "POA → SLZ · noite SLZ ou Barreirinhas", "Base MA"],
        ["01/08", "sáb", "Barreirinhas / preparo / ATM cash", "Barreirinhas"],
        ["02–05/08", "4d", "Travessia (melhor nível de lagoas)", "Oásis"],
        ["06/08", "qui", "Santo Amaro → Parnaíba / Delta", "Parnaíba"],
        ["07/08", "sex", "Delta / revoada guarás · transfer → Jeri", "Jeri"],
        ["08–11/08", "4d", "Jeri cheia: Leste + Oeste + folga + forró", "Jeri"],
        ["12/08", "qua", "Saída Jeri → Fortaleza", "Noite FOR"],
        ["13/08", "qui", "Voo FOR→POA 12:50", "POA"],
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
    outbound: "#0e8a86",
    transfers: "#3ecfc4",
    hotels: "#b8956a",
    food: "#d9c4a0",
    tours: "#5aa9a6",
    extras: "#8aa8a5",
  };

  const DEFAULT_CHECKS = {
    chkTrek: false,
    chkPerguntas: false,
    chkOutbound: false,
    chkTransferJeri: false,
    chkHotelJeri: false,
    chkFor13: false,
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
    const transfers = s.transfers + (jeriNights === 0 ? -200 : 0);
    const food = s.food + (jeriNights === 0 ? -200 : jeriNights === 4 ? 120 : 0);
    const items = {
      trek,
      outbound: s.outbound,
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
    tripDays: String(saved?.tripDays || "12"),
    jeriNights: String(saved?.jeriNights ?? "3"),
    trekMode: saved?.trekMode || "cotacao",
    tab: saved?.tab || "visao",
    notes: saved?.notes || "",
    checks: { ...DEFAULT_CHECKS, ...(saved?.checks || {}) },
  };

  const els = {
    scenario: document.getElementById("scenario"),
    tripDays: document.getElementById("tripDays"),
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
    els.tripDays.value = state.tripDays;
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
        <div class="stat__label">Gasto estimado / pessoa · ${SCENARIO_META[state.scenario].label}</div>
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
        <div class="stat__value">${state.jeriNights} noites</div>
        <div class="stat__label">Jeri · calendário ${state.tripDays}d</div>
      </div>
    `;
  }

  function renderUsage(budget) {
    const pct = Math.min(100, Math.round((budget.total / CAP) * 100));
    const segs = [
      ["trek", "Travessia"],
      ["outbound", "Voo ida"],
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
        <span>${pct}% do teto R$ 6.000</span>
        <span>${money(budget.total)} / ${money(CAP)}</span>
      </div>
      <div class="usage__track">${bars}</div>
      <div class="usage__legend">${legend}</div>
      <p class="muted" style="margin:0.75rem 0 0">
        Volta FOR–POA (${money(RETURN_PAID)}) já paga e fora do teto. Valores aproximados mercado jul/2026.
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
            <div class="chart-bars__track chart-bars__cap" style="--cap:100%">
              <div class="chart-bars__fill" style="width:${w}%"></div>
            </div>
            <div class="num">${money(totals[i])}</div>
          </div>`;
      })
      .join("");

    return `
      <section class="section is-active" data-section="visao">
        <h2>Mapa da decisão</h2>
        <p class="lede">Tudo gira em torno da volta em 13/08 e do teto de ${money(CAP)}/pessoa (avião pago fora).</p>
        <div class="grid-2">
          <div class="block">
            <div class="block__title">Já fechado <span class="tag tag--ok">âncora</span></div>
            <p>Volta Fortaleza → Porto Alegre · qui 13/08 · 12:50–18:50 · Azul · 1 parada.</p>
            <p class="muted">Volta Azul já comprada · 1 parada · econômica · sem bagagem despachada (detalhes da reserva ficam só no e-mail/app).</p>
            <p>Cotação travessia 4 dias: <b>${money(TREK_QUOTE)}/pessoa</b> (casal = ${money(TREK_QUOTE * 2)}).</p>
          </div>
          <div class="block">
            <div class="block__title">Próximas travas <span class="tag tag--warn">urgente</span></div>
            <ol>
              <li>Confirmar inclusões da cotação R$ 2.100</li>
              <li>Comprar POA → SLZ alinhado ao calendário ${state.tripDays}d</li>
              <li>Reservar transfer Lençóis → Jeri</li>
              <li>Travar Jeri→FOR do dia 13 (privativo ou noite em FOR)</li>
            </ol>
          </div>
        </div>
        <h3>Matriz Jeri vs teto</h3>
        ${table(
          ["Opção", "Noites", "Fit no teto", "Experiência"],
          [
            ["Pular Jeri", "0", "Folgado", "Foco total Lençóis"],
            ["Jeri curta", "2", "Seguro no Enxuto", "Duna + 1 lado lagoas"],
            ["Jeri equilíbrio", "3", "Melhor fit Equilibrado", "Descanso + Leste + folga"],
            ["Jeri cheia", "4+", "Só se ida ≤ ~R$ 1.100", "Leste + Oeste + gastronomia"],
          ],
          { tones: ["", "info", "ok", "warn"] }
        )}
        <h3>Comparativo de cenários (R$/pessoa)</h3>
        <div class="chart-bars">${bars}</div>
        <p class="muted">Linha de referência visual = teto R$ 6.000. Cenário atual: ${money(budget.total)}.</p>
        <div class="alert alert--info">
          <strong>Veredito</strong>
          Com a cotação de R$ 2.100, o perfil Equilibrado + 2–3 noites em Jeri é o caminho mais realista. A cotação está na faixa média-baixa do mercado — confirme se transfers SLZ estão inclusos.
        </div>
      </section>`;
  }

  function sectionCalendario() {
    const cal = CALENDARS[state.tripDays];
    return `
      <section class="section is-active" data-section="calendario">
        <h2>${cal.title}</h2>
        <p class="lede">Calendário contado de trás a partir da volta em Fortaleza.</p>
        ${table(["Data", "Dia", "Plano", "Pernoite"], cal.rows)}
        <div class="grid-3">
          <div class="block">
            <div class="block__title">Por que 12 dias</div>
            <p>Buffer em Barreirinhas + travessia na 1ª quinzena + dia de descanso em Jeri + noite em Fortaleza no dia 12.</p>
          </div>
          <div class="block">
            <div class="block__title">Risco do 10 dias</div>
            <p>Chegada cansada em Jeri; só 2 noites úteis; sem margem se o trek atrasar.</p>
          </div>
          <div class="block">
            <div class="block__title">14 dias + Delta</div>
            <p>Parnaíba / guarás. Charmoso, mas come ~R$ 300–600 extras — melhor no Enxuto ou sem buggy privativo.</p>
          </div>
        </div>
      </section>`;
  }

  function sectionTravessia() {
    return `
      <section class="section is-active" data-section="travessia">
        <h2>Travessia 4 dias</h2>
        <p class="lede">Sentido clássico Atins → Santo Amaro (a favor do vento). ~40–50 km · nível moderado · saídas 2h–5h · redário nos oásis.</p>
        <h3>Itinerário típico</h3>
        ${table(
          ["Dia", "Rota", "km a pé", "Pernoite"],
          [
            ["1", "Barreirinhas → lancha → Atins → 4×4 → Baixa Grande", "8–10", "Baixa Grande"],
            ["2", "Baixa Grande → Queimada dos Britos", "8–12", "Queimada"],
            ["3", "Queimada → Betânia (dia longo)", "14–18", "Betânia"],
            ["4", "Betânia → Santo Amaro (a pé ou caiaque) → transfer", "0–12", "SLZ / Jeri / SA"],
          ]
        )}
        <h3>Operadoras e preços (jul/2026)</h3>
        ${table(
          ["Operador", "Preço/pess.", "Destaque", "Status"],
          [
            ["Cotação de vocês", money(TREK_QUOTE), "Comparar inclusões por escrito", "Privada"],
            ["Mangue Brasil", "R$ 1.580 PIX", "Grupo mín. 10 · saída 27–30/08", "Site"],
            ["Borandá Trekking", "R$ 3.220–4.420", "Hostel + transfers + seguro", "Site"],
            ["Lençóis Trekking", "R$ 3.700 PIX", "Transfer SLZ · caiaque dia 4", "Site"],
            ["Trilha Tour", "a partir R$ 3.950", "Pacote oásis completo", "Site"],
            ["PlanetaEXO", "~USD 600", "Parceiro local", "Site"],
            ["TDB Turismo", "R$ 4.865", "Pacote 11–16/08/2026", "Site"],
          ],
          { tones: ["ok", "info", "", "", "", "", "warn"], aligns: ["left", "right", "left", "left"] }
        )}
        <div class="alert alert--warn">
          <strong>Perguntas ao guia dos R$ 2.100</strong>
          Transfer SLZ↔base incluso? Lancha + 4×4? Refeições/água? Grupo mínimo (saída a 2)? Condutor ICMBio? Seguro? Mala grande? Datas compatíveis com 13/08? Sinal e cancelamento?
        </div>
        <div class="grid-2">
          <div class="block">
            <div class="block__title">Geralmente incluso</div>
            <ul>
              <li>Guia local credenciado</li>
              <li>3 noites redário</li>
              <li>Café / almoço / jantar nos oásis</li>
              <li>Lancha e/ou 4×4 internos</li>
              <li>Às vezes van SLZ (só pacotes “completos”)</li>
            </ul>
          </div>
          <div class="block">
            <div class="block__title">Geralmente fora</div>
            <ul>
              <li>Passagens e hotéis fora da trilha</li>
              <li>Água / bebidas nos oásis</li>
              <li>Almoço dia 1 no porto / Caburé</li>
              <li>Gorjetas · evacuação</li>
              <li>ICMBio: sem taxa de entrada</li>
            </ul>
          </div>
        </div>
        <h3>Alternativas</h3>
        ${table(
          ["Opção", "Perfil", "Preço aprox."],
          [
            ["Travessia 3d/2n", "Mais intensa", "R$ 1.900–3.570"],
            ["Jeep Azul + Bonita", "Leve, 1 dia", "R$ 109–280/pess."],
            ["Bate-volta Santo Amaro", "Lagoas Gaivota/Peixe/Junco", "~R$ 230/pess."],
            ["Circuito bases sem trek", "Conforto", "R$ 1.700–2.000+"],
          ]
        )}
      </section>`;
  }

  function sectionLogistica() {
    return `
      <section class="section is-active" data-section="logistica">
        <h2>Logística ponta a ponta</h2>
        <h3>1. Voo POA → SLZ</h3>
        ${table(
          ["Item", "Detalhe"],
          [
            ["Companhias", "Azul, GOL, LATAM — quase sempre 1 conexão"],
            ["Duração", "Melhor ~5h40–7h · comuns 8–15h"],
            ["Preço só ida ago/2026", "Ofertas ~R$ 470–800 · Azul típico ~R$ 1.035 · picos R$ 1.400+"],
            ["Meta no cenário", money(SCENARIO_META[state.scenario].outbound)],
            ["Dica horário", "Chegar SLZ até meio-dia → van no mesmo dia (~4h)"],
          ]
        )}
        <h3>2. São Luís ↔ Barreirinhas</h3>
        ${table(
          ["Modal", "Duração", "Preço/pess.", "Notas"],
          [
            ["Ônibus", "4h30–5h", "R$ 70–75", "Buson"],
            ["Van compartilhada", "3h30–4h30", "R$ 100–160", "Aeroporto/centro"],
            ["Privativo", "~4h", "sob consulta", "Flexível p/ voos"],
            ["Santo Amaro → SLZ", "4–5h", "muitas vezes no pacote", "Confirmar guia"],
          ],
          { aligns: ["left", "left", "right", "left"] }
        )}
        <h3>3. Lençóis → Jericoacoara</h3>
        ${table(
          ["Opção", "Duração", "Preço", "Quando usar"],
          [
            ["Van compartilhada asfalto", "7–9h", "R$ 460–650", "Padrão custo-benefício"],
            ["Privativo 4×4", "7–9h", "R$ 1.650–2.000/carro", "Casal divide ~R$ 825–1.000"],
            ["Santo Amaro → Jeri", "~9h", "~R$ 750", "Se trek termina em SA"],
            ["Via praia (privativo)", "7–11h", "mais caro", "Cenário / foto"],
            ["Via Delta", "+1–2 dias", "+R$ 160–170/trecho", "Calendário 14 dias"],
            ["Azul Conecta (Cessna)", "aéreo", "a partir ~R$ 800", "Malha irregular"],
            ["Ônibus Guanabara", "longo", "R$ 100–120", "Só alguns dias"],
          ],
          { tones: ["ok", "info", "info", "", "", "warn", ""], aligns: ["left", "left", "right", "left"] }
        )}
        <h3>4. Jeri → Aeroporto FOR (13/08)</h3>
        ${table(
          ["Opção", "Saída", "Chegada FOR", "Serve 12:50?", "Preço"],
          [
            ["Compartilhado regular", "~10:30–11:00", "~18:00", "Não", "R$ 100–300"],
            ["Privativo 4×4", "~4h–5h30", "4,5–6h depois", "Sim", "R$ 700–900/carro"],
            ["Pernoite Fortaleza 12/08", "dia 12", "tarde/noite 12", "Sim (mais seguro)", "+ hotel R$ 150–300"],
            ["Ônibus Guanabara", "manhã/tarde", "7h+", "Não", "R$ 80–175"],
          ],
          { tones: ["alert", "ok", "ok", "alert"] }
        )}
        <div class="alert alert--danger">
          <strong>Decisão obrigatória</strong>
          Escolham agora: (A) privativo de madrugada no dia 13, ou (B) última noite em Fortaleza. Não deixem para a semana da viagem.
        </div>
      </section>`;
  }

  function sectionJeri() {
    return `
      <section class="section is-active" data-section="jeri">
        <h2>Jericoacoara e o circuito das lagoas</h2>
        <div class="alert alert--info">
          <strong>Nome correto</strong>
          A Rota Romântica oficial é do RS. Em Jeri peçam “Lado Leste / Lagoa do Paraíso” — ou a Rota das Emoções (Lençóis → Delta → Jeri).
        </div>
        <h3>Passeios — preços para 2</h3>
        ${table(
          ["Passeio", "Conteúdo", "Compartilhado", "Buggy privativo"],
          [
            ["Litoral Leste", "Paraíso, Azul, Buraco Azul, Preá", "R$ 140–240 casal", "R$ 360–600/buggy"],
            ["Litoral Oeste", "Guriú, Mangue Seco, Tatajuba", "R$ 140–260 casal", "R$ 380–550/buggy"],
            ["Barrinha", "Preá, Barrinha, dunas", "~R$ 150 casal", "R$ 370–500/buggy"],
            ["Pedra Furada", "A pé na maré baixa", "Grátis", "opcional"],
            ["Duna do Pôr do Sol", "Ritual diário", "Grátis", "—"],
          ],
          { aligns: ["left", "left", "right", "right"] }
        )}
        <p class="muted">TTS 2026: R$ 41,50/pessoa — só no canal oficial ADEJERI. Extras: cavalo-marinho ~R$ 20 · tirolesa ~R$ 10–20 · almoço lagoa R$ 40–80.</p>
        <h3>Hospedagem (duplo / noite, agosto)</h3>
        ${table(
          ["Faixa", "Diária", "Perfil"],
          [
            ["Econômica", "R$ 150–350", "Hostel / pousada simples"],
            ["Média", "R$ 300–700", "Pousada do Maurício, Casa do Angelo…"],
            ["Boutique", "R$ 500–1.200+", "Villa Mango e similares"],
            ["Preá / kite", "R$ 1.000–2.500+", "Rancho do Peixe"],
          ],
          { aligns: ["left", "right", "left"] }
        )}
        <h3>Roteiro Jeri sugerido (3 noites)</h3>
        ${table(
          ["Dia", "Plano"],
          [
            ["Chegada", "Só descanso + pôr do sol na duna + jantar leve"],
            ["Dia 2", "Leste compartilhado — prioridade Lagoa do Paraíso"],
            ["Dia 3", "Pedra Furada (maré baixa) + vila OU Oeste"],
            ["Saída", "Manhã livre · transfer FOR (ideal tarde do dia anterior)"],
          ]
        )}
        <div class="grid-2">
          <div class="block">
            <div class="block__title">Comida (casal / dia)</div>
            <ul>
              <li>Econômico: R$ 160–240</li>
              <li>Confortável: R$ 240–400</li>
              <li>Gourmet/beach club: R$ 400–700+</li>
            </ul>
          </div>
          <div class="block">
            <div class="block__title">Side trips</div>
            <ul>
              <li>Preá: kite + vila mais quieta</li>
              <li>Tatajuba: já no Lado Oeste</li>
              <li>Camocim / Ilha do Amor: transfer praia ~R$ 1.260/carro</li>
            </ul>
          </div>
        </div>
        <div class="alert alert--warn">
          <strong>Pós-travessia</strong>
          O primeiro dia em Jeri deve ser leve. Vocês chegam de 7–9h de estrada depois de 4 dias andando na areia.
        </div>
      </section>`;
  }

  function sectionOrcamento(budget) {
    const rows = [
      ["Travessia", budget.items.trek],
      ["Voo POA→SLZ", budget.items.outbound],
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
    tableRows.push(["TOTAL", money(budget.total), `${Math.round((budget.total / CAP) * 100)}%`]);

    let acc = 0;
    const pieParts = rows.map(([label, value], i) => {
      const start = acc;
      const pct = (value / budget.total) * 100;
      acc += pct;
      return { label, value, start, pct, color: Object.values(SEG_COLORS)[i] };
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
        <h2>Orçamento vivo — ${SCENARIO_META[state.scenario].label}</h2>
        <p class="lede">Por pessoa · teto ${money(CAP)} · volta já paga fora · Jeri ${state.jeriNights} noites · trek ${state.trekMode}</p>
        <div class="grid-2">
          <div>
            ${table(["Item", "R$/pessoa", "% do teto"], tableRows, {
              aligns: ["left", "right", "right"],
              tones: Array(rows.length).fill("").concat([budget.remaining < 0 ? "alert" : "ok"]),
            })}
            <p class="muted">Casal (×2, hotéis já rateados): ~${money(budget.total * 2)}. Folga individual: ${money(budget.remaining)}.</p>
          </div>
          <div class="block">
            <div class="block__title">Composição do gasto</div>
            <div class="pie-wrap">
              <div class="pie" style="background:conic-gradient(${gradient})" data-center="${money(budget.total)}"></div>
            </div>
            <div class="block__title">Onde a maioria estoura</div>
            <ol>
              <li>Voo de ida com bagagem</li>
              <li>Buggy privativo + beach clubs</li>
              <li>Transfer Lençóis→Jeri + noite extra</li>
              <li>Cash-back caro em Jeri (10–15%)</li>
              <li>Noites ponte por conexão ruim</li>
            </ol>
          </div>
        </div>
        <h3>Economias que não estragam</h3>
        <div class="tip-grid">
          <div>Fechar ida POA–SLZ agora</div>
          <div>1 buggy compartilhado + duna grátis</div>
          <div>PF no almoço; 1–2 jantares bons</div>
          <div>Van compartilhada; privativo só no dia 13</div>
          <div>Não repetir jeep Azul+Bonita após o trek</div>
          <div>Sacar em SLZ/Barreirinhas antes de Atins/Jeri</div>
        </div>
      </section>`;
  }

  function sectionPrazos() {
    return `
      <section class="section is-active" data-section="prazos">
        <h2>Prazos e ordem de reserva</h2>
        <p class="lede">Volta em 13/08 · janela curta · alta temporada.</p>
        ${table(
          ["#", "O quê", "Quando", "Por quê"],
          [
            ["1", "Travessia (datas + depósito 30–50%)", "Imediato", "Oásis lotam em ago"],
            ["2", "Voo POA→SLZ", "Esta semana", "Maior variável do orçamento"],
            ["3", "Transfer pós-trek → Jeri", "Com fim da trilha definido", "Frequência limitada"],
            ["4", "Pousada Jeri", "Já apertado", "Centro some em agosto"],
            ["5", "Jeri→FOR dia 13 ou hotel FOR 12/08", "2–4 semanas", "Bloqueio do voo 12:50"],
            ["6", "1 noite Barreirinhas", "Com voo fechado", "Buffer físico"],
            ["7", "TTS + seguro + chip Vivo + buggy", "1–2 semanas / na chegada", "TTS online ADEJERI"],
          ]
        )}
        <h3>Agosto e lagoas</h3>
        ${table(
          ["Fator", "Expectativa"],
          [
            ["Chuva", "Baixa — fim da estação chuvosa"],
            ["Lagoas Lençóis", "Ainda boas; melhor na 1ª quinzena; Santo Amaro segura mais água"],
            ["Vento", "Forte — chapéu com cordão"],
            ["Jeri", "Sol + vento + lagoas ok; hotéis caros"],
            ["Pergunta ao guia", "1–2 semanas antes: nível das lagoas da rota"],
          ]
        )}
      </section>`;
  }

  function sectionChecklist() {
    const items = [
      ["chkTrek", "Travessia confirmada por escrito (inclusões + datas)"],
      ["chkPerguntas", "Perguntas da cotação R$ 2.100 respondidas"],
      ["chkOutbound", "Voo POA→SLZ comprado (horário ok p/ van)"],
      ["chkTransferJeri", "Transfer Lençóis→Jeri reservado"],
      ["chkHotelJeri", "Pousada Jeri (e/ou Fortaleza 12/08)"],
      ["chkFor13", "Plano Jeri→FOR do dia 13 travado"],
      ["chkTpa", "TTS Jeri (R$ 41,50) no canal oficial"],
      ["chkSeguro", "Seguro com cobertura de trekking/aventura"],
      ["chkCash", "Plano de saque SLZ/Barreirinhas (~R$ 800–1.500 casal)"],
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
        <p class="lede">Marque conforme forem fechando — salva neste navegador.</p>
        <div class="block">
          <div class="block__title">Reservas</div>
          <div class="check-list">${checks}</div>
        </div>
        <h3>Kit da travessia</h3>
        ${table(
          ["Item", "Nota"],
          [
            ["Mochila 25–35 L", "Peso alvo ~4–5 kg"],
            ["2–3 dry-fit UV + banho ×2", "Meias de trilha / compressão"],
            ["Chapéu cordinha + óculos + FPS", "Vento forte em ago"],
            ["Capacidade 2–3 L água", "ICMBio recomenda ≥3 L/dia"],
            ["Headlamp + power bank + estanque", "Saídas 2h–5h"],
            ["Tampões + tapa-olho", "Redário coletivo"],
            ["Espécie + remédios + snacks", "PIX falha nos oásis"],
            ["Chip Vivo / eSIM", "Melhor sinal Atins/Jeri"],
          ]
        )}
        <h3>Notas do casal</h3>
        <div class="block">
          <textarea class="notes" id="notesField" placeholder="Cole WhatsApps do guia, vouchers e decisões…"></textarea>
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
        <h2>Dicas de fóruns e operação</h2>
        <div class="grid-2">
          <div class="block">
            <div class="block__title">Lençóis — o que surpreende</div>
            <ul>
              <li>Acordar 2h–5h é regra</li>
              <li>No oásis o calor aperta mais que na duna</li>
              <li>Areia geralmente não queima — meia ou descalço</li>
              <li>Alta temporada: oásis lotados</li>
              <li>Sem lagoas (out–abr) a travessia perde o sentido</li>
            </ul>
          </div>
          <div class="block">
            <div class="block__title">Jeri — armadilhas</div>
            <ul>
              <li>TTS só no canal oficial ADEJERI</li>
              <li>Bugueiro credenciado; preço fechado do buggy</li>
              <li>Carro comum não entra na vila</li>
              <li>ATM: não na vila — sacar antes</li>
              <li>Pedra Furada a pé depende de maré baixa</li>
            </ul>
          </div>
        </div>
        <h3>Dinheiro e conectividade</h3>
        ${table(
          ["Local", "ATM", "PIX/cartão", "Sinal"],
          [
            ["São Luís / aeroporto", "Sim", "Sim", "OK"],
            ["Barreirinhas", "Sim (último confiável)", "Sim", "OK centro"],
            ["Atins / oásis", "Não", "Falhou se rede cair", "Vivo melhor; dunas zero"],
            ["Jeri vila", "Não", "Amplo (bugueiros às vezes cash)", "Melhorou; ainda falha"],
            ["Jijoca", "Sim", "Sim", "Parada no transfer"],
          ]
        )}
        <h3>Fornecedores úteis</h3>
        ${table(
          ["Uso", "Nome / link"],
          [
            ["Transfers Rota das Emoções", "rotacombo.com"],
            ["Transfer Barreirinhas↔Jeri", "RTUR · Jeri Tur · Pedra Furada Experience"],
            ["Van SLZ–Barreirinhas", "transferbarreirinhas.com · Rota Combo"],
            ["TTS Jeri", "adejeri.jijocadejericoacoara.ce.gov.br"],
            ["Parque Lençóis", "gov.br/icmbio · PARNA Lençóis"],
            ["Relatos / custos", "viajenaviagem.com · mochileiros.com"],
            ["Volta já reservada", "Azul FOR→POA · voucher no e-mail/app"],
          ]
        )}
        <h3>Documentos na mala</h3>
        <div class="pill-row">
          <span class="pill">RG/CNH + CPF</span>
          <span class="pill">Vouchers voo ida+volta</span>
          <span class="pill">Confirmação trek</span>
          <span class="pill">2 cartões + PIX</span>
          <span class="pill">WhatsApp guia/transfers</span>
          <span class="pill">Mapas offline</span>
        </div>
        <p class="muted" style="margin-top:1.5rem">
          Preços de mercado mudam — trate faixas como orientação e reconfirme na reserva.
          Dados da volta extraídos de fortaleza.txt.
        </p>
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
    els.footerStatus.textContent = `Cenário ativo: ${SCENARIO_META[state.scenario].label} · ${state.tripDays} dias · Jeri ${state.jeriNights}n · trek ${money(budget.trek)}`;
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

  ["scenario", "tripDays", "jeriNights", "trekMode"].forEach((key) => {
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
    state.tripDays = "12";
    state.jeriNights = "3";
    state.trekMode = "cotacao";
    state.tab = "visao";
    render();
    document.getElementById("painel")?.scrollIntoView({ behavior: "smooth" });
  });

  render();
})();
