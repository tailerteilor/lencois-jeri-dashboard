(() => {
  const CAP = 6000;
  const OUTBOUND_PAID = 580;
  const RETURN_PAID = 589;
  const TREK_QUOTE = 2100;
  const STORAGE_KEY = "lencois-jeri-dashboard-v4";

  const SCENARIO = {
    enxuto: {
      label: "Enxuto",
      hotelBrr: 90,
      hotelAtins: 140,
      hotelSa: 100,
      hotelJeriNight: 140,
      hotelFor: 120,
      foodDay: 70,
      why: "Pousadas simples, 1 passeio Jeri compartilhado, vans. Mais folga no teto.",
    },
    equilibrado: {
      label: "Equilibrado",
      hotelBrr: 130,
      hotelAtins: 200,
      hotelSa: 140,
      hotelJeriNight: 200,
      hotelFor: 180,
      foodDay: 95,
      why: "Bom custo-benefício: pousada decente, Leste em jardineira/buggy rateado, noite FOR no dia 12.",
    },
    confortavel: {
      label: "Confortável",
      hotelBrr: 200,
      hotelAtins: 320,
      hotelSa: 220,
      hotelJeriNight: 320,
      hotelFor: 280,
      foodDay: 140,
      why: "Mais conforto e 2 passeios em Jeri. Com aviões + Walter R$ 2.100 pode estourar — use o checklist para cortar.",
    },
  };

  /** Catálogo de fornecedores (público — sem dados pessoais do casal) */
  const SUPPLIERS = [
    {
      id: "walter",
      name: "Guia Walter — Travessia Atins → Santo Amaro",
      category: "Travessia",
      what: "4 dias a pé; encontro em Atins; alimentação nos dias de trilha inclusa. NÃO inclui lancha BRR→Atins.",
      price: "R$ 2.100/pessoa (cotação de vocês)",
      contact: "Contato que vocês já têm (WhatsApp do guia)",
      links: [],
      tips: "Perguntar: horário de encontro em Atins no dia 05 (ou 04 tarde no plano direto); onde deixa mala grande; horário de chegada em Santo Amaro no último dia; grupo mínimo.",
    },
    {
      id: "kairos",
      name: "Kairós Tur — Van SLZ ↔ Barreirinhas",
      category: "Transfer São Luís",
      what: "Van/micro compartilhado diário. Embarque hotéis + aeroporto (último ponto). ~4h.",
      price: "A partir de ~R$ 130/pessoa/trecho",
      contact: "WhatsApp +55 98 98852-7434 · kairosturslz@gmail.com",
      links: [
        { label: "Site", href: "https://www.kairostur.com.br/" },
        {
          label: "Loja — transfer SLZ→BRR",
          href: "https://loja.kairostur.com.br/passeio/transfer-sao-luis-a-barreirinhas-compartilhado",
        },
      ],
      tips: "Saídas SLZ típicas: 04:00, 08:00, 12:30, 17:30. No dia 03/08 o alvo é 12:30 (embarque aeroporto após hotéis). Plano B: 17:30.",
    },
    {
      id: "satur",
      name: "Satur Turismo — Lancha BRR ↔ Atins",
      category: "Lancha Rio Preguiças",
      what: "Lancha coletiva direta (~1h). Transfer porto↔pousada costuma estar incluso.",
      price: "~R$ 70–150/pessoa (mercado recente ~R$ 80–100)",
      contact: "WhatsApp +55 98 99232-8780",
      links: [{ label: "Referência horários", href: "https://www.viladasaguas.com/pt/destination.html" }],
      tips: "Saída BRR→Atins ~12:30. Retorno Atins→BRR ~07:00. NÃO opera aos sábados — no dia 04/08 (terça) opera normalmente.",
    },
    {
      id: "kbeca",
      name: "K-Beça Turismo — Lancha BRR ↔ Atins",
      category: "Lancha Rio Preguiças",
      what: "Alternativa à Satur; opera também aos sábados.",
      price: "~R$ 70–150/pessoa",
      contact: "WhatsApp +55 98 98827-7715 ou +55 98 98153-8002",
      links: [{ label: "Guia Atins (referência)", href: "https://getoutside.com.br/tudo-que-voce-precisa-saber-sobre-atins/" }],
      tips: "Cotem as duas no mesmo dia e fiquem com quem confirmar vaga + transfer até a pousada.",
    },
    {
      id: "memory",
      name: "Memory Tur — Lancha 16h (alta temporada)",
      category: "Lancha Rio Preguiças",
      what: "Lancha ~16:00 BRR→Atins em alta temporada (jun–set), útil como plano B.",
      price: "Sob consulta",
      contact: "WhatsApp +55 98 99134-2873",
      links: [],
      tips: "Não contem como certo — confirmem na semana. Útil se perderem a 12:30.",
    },
    {
      id: "maventur_atins",
      name: "Maventur — Passeios em Atins",
      category: "Atins (dia livre)",
      what: "Canto do Atins, Ponta do Mangue, dia inteiro, revoada dos guarás, quadriciclo.",
      price: "Canto/Ponta ~R$ 190 · Dia inteiro ~R$ 280 · Guarás ~R$ 190 · Quad ~R$ 1.500",
      contact: "Pelo site / WhatsApp da operadora",
      links: [
        { label: "Passeios em Atins", href: "https://maventur.com.br/passeios-em-atins/" },
        { label: "Site", href: "https://maventur.com.br/" },
      ],
      tips: "Em agosto as lagoas próximas a Atins costumam pedir 4×4/quad mais que caminhada longa. Ideal para o dia 04 no plano com noite em Atins.",
    },
    {
      id: "atins_adv",
      name: "Atins Lençóis Adventure",
      category: "Atins / Barreirinhas",
      what: "Circuitos Caburé (lancha com paradas), Atins, Lagoa Azul, Bonita.",
      price: "Circuito Caburé ~R$ 180/pessoa (referência site)",
      contact: "Pelo site",
      links: [{ label: "Site", href: "https://atinslencoisadventure.tur.br/" }],
      tips: "Se quiserem o passeio do Rio Preguiças COM paradas (Vassouras, Mandacaru, Caburé), saem ~08:30 de BRR — só no plano em que já estão em Barreirinhas na manhã do dia 04.",
    },
    {
      id: "rotacombo",
      name: "Rota Combo — Transfer Lençóis ↔ Jeri",
      category: "Transfer pós-trek",
      what: "Compartilhado BRR→Jeri: terça, quinta, sábado ~9–10h · ~7h30 · ~R$ 460–495/pess. Privativo diário.",
      price: "Compartilhado ~R$ 460–495/pess. · Privativo até 3 pess. ~R$ 1.860/carro",
      contact: "0800 717 7701 · (86) 3323-9888 · WhatsApp +55 86 99993-0111",
      links: [
        {
          label: "Transfer BRR/Jeri",
          href: "https://rotacombo.com/passeio/transfer-jericoacoara-barreirinhas/",
        },
        {
          label: "BRR → Jijoca",
          href: "https://rotacombo.com/passeio/transfer-barreirinhas-jijoca/",
        },
        { label: "Privativos", href: "https://rotacombo.com/transfers-privativos/" },
      ],
      tips: "Plano DIRETO (fim trek sex 07): pegar compartilhado sáb 08. Plano ATINS (fim trek sáb 08): compartilhado da manhã do sábado é inviável — usar privativo sáb tarde/domingo ou esperar terça.",
    },
    {
      id: "coopbj",
      name: "COOPBJ — Bugueiros de Jericoacoara",
      category: "Jeri · Lado Leste (rota de casal)",
      what: "Buggy privativo Leste: Preguiça, Preá, Buraco Azul, Lagoa Azul, Paraíso, Amâncio. ~6h. Até 4 pessoas.",
      price: "R$ 500/buggy (até 4) = R$ 250/pessoa para o casal",
      contact: "Pelo site da cooperativa",
      links: [{ label: "Passeio Leste", href: "https://coopbjj.com.br/leste/" }],
      tips: "Entradas à parte (por pessoa): Alchymist ~R$ 50, Lagoa Azul ~R$ 40, Buraco Azul ~R$ 30, Lagun ~R$ 30. Levem espécie.",
    },
    {
      id: "obajeri",
      name: "Oba Jeri — Buggy Litoral Leste",
      category: "Jeri · Lado Leste",
      what: "Mesmo circuito romântico (Paraíso etc.).",
      price: "A partir de ~R$ 399/buggy",
      contact: "Pelo site",
      links: [
        {
          label: "Buggy Leste",
          href: "https://obajeri.com.br/servico/passeio-buggy-litoral-leste/",
        },
      ],
      tips: "Cotar Oba × COOPBJ × TourFácil no mesmo dia — preços oscilam R$ 399–600/buggy.",
    },
    {
      id: "tourfacil",
      name: "TourFácil — Leste / Oeste Jeri",
      category: "Jeri",
      what: "Marketplace de tours; Leste a partir de ~R$ 450/buggy.",
      price: "~R$ 450/buggy (referência)",
      contact: "WhatsApp no site",
      links: [
        {
          label: "Leste",
          href: "https://www.tourfacil.com.br/jericoacoara/passeios/tour-de-buggy-litoral-leste-de-jericoacoara",
        },
      ],
      tips: "Confirmar se é privativo ou compartilhado antes de pagar.",
    },
    {
      id: "adejeri",
      name: "ADEJERI — TTS (taxa municipal)",
      category: "Jeri · obrigatório",
      what: "Taxa de Turismo Sustentável — só canal oficial.",
      price: "~R$ 41,50/pessoa (valores mudam; confirmar no site oficial)",
      contact: "Canal oficial ADEJERI / prefeitura Jijoca",
      links: [],
      tips: "Não paguem TTS em camelô/guia de rua. Guarde o comprovante.",
    },
  ];

  /**
   * Itens de orçamento com checklist.
   * pp = preço por pessoa; halfCar = divide carro por 2.
   * plans: quais planos mostram o item (default ambos)
   */
  function buildCatalog(scenario, plan, trekMode, jeriNights) {
    const s = SCENARIO[scenario];
    const trek =
      trekMode === "cotacao" ? TREK_QUOTE : trekMode === "grupo_barato" ? 1580 : 3700;
    const jeriN = Number(jeriNights || 3);

    const foodTrekDays = 0; // Walter inclui alimentação
    const foodNonTrek =
      plan === "atins"
        ? s.foodDay * 6 // 03 BRR, 04 Atins, 08/09 transfer+chegada, 3 dias Jeri approx, 12 FOR — aproximado via checklist
        : s.foodDay * 5;

    return [
      {
        id: "outbound",
        group: "1. Voos (já pagos · no teto)",
        label: "Ida LATAM POA→SLZ 03/08",
        pp: OUTBOUND_PAID,
        defaultOn: true,
        locked: true,
        meta: "Já pago · ~R$ 1.159,14 / 2. Entra no teto.",
      },
      {
        id: "inbound",
        group: "1. Voos (já pagos · no teto)",
        label: "Volta Azul FOR→POA 13/08",
        pp: RETURN_PAID,
        defaultOn: true,
        locked: true,
        meta: "Já pago · ~R$ 1.178,82 / 2. Entra no teto.",
      },
      {
        id: "trek",
        group: "2. Travessia (Walter)",
        label: "Pacote trilha 4 dias",
        pp: trek,
        defaultOn: true,
        locked: false,
        meta: "Incluso: guia + oásis + alimentação nos dias de trilha. Encontro em Atins. Fora: lancha BRR→Atins.",
      },
      {
        id: "food_trek_zero",
        group: "2. Travessia (Walter)",
        label: "Alimentação nos dias de trilha",
        pp: foodTrekDays,
        defaultOn: true,
        locked: true,
        meta: "R$ 0 — inclusa no valor do Walter. Não somem restaurante nesses dias.",
      },
      {
        id: "lancha",
        group: "3. Chegada aos Lençóis",
        label: "Lancha Barreirinhas → Atins (conta de vocês)",
        pp: 100,
        defaultOn: true,
        meta: "Satur / K-Beça · ~12:30 · ~R$ 70–150. NÃO está no pacote do Walter.",
      },
      {
        id: "van_slz",
        group: "3. Chegada aos Lençóis",
        label: "Van SLZ → Barreirinhas (03/08)",
        pp: 130,
        defaultOn: true,
        meta: "Kairós ~R$ 130 · alvo saída 12:30 · plano B 17:30.",
      },
      {
        id: "hotel_brr_03",
        group: "3. Chegada aos Lençóis",
        label: "Pousada Barreirinhas noite 03/08",
        pp: s.hotelBrr,
        defaultOn: true,
        meta: "Obrigatória — não dá para pegar lancha 12:30 no dia 03.",
      },
      {
        id: "food_brr_03",
        group: "3. Chegada aos Lençóis",
        label: "Comida Barreirinhas (03 noite + 04 manhã)",
        pp: Math.round(s.foodDay * 1.3),
        defaultOn: true,
        meta: "Jantar + café/almoço antes da lancha.",
      },
      {
        id: "hotel_atins_04",
        group: "4. Noite / dia em Atins",
        label: "Pousada Atins noite 04/08",
        pp: s.hotelAtins,
        defaultOn: plan === "atins",
        plans: ["atins"],
        meta: "Só no plano COM noite em Atins. Vila charmosa — vale a pena se aceitarem o impacto no transfer.",
      },
      {
        id: "food_atins_04",
        group: "4. Noite / dia em Atins",
        label: "Comida Atins dia 04 (fora da trilha)",
        pp: Math.round(s.foodDay * 1.4),
        defaultOn: plan === "atins",
        plans: ["atins"],
        meta: "Camarão no Canto do Atins ~R$ 45/pessoa + jantar na vila. Trilha ainda não começou → comida NÃO inclusa.",
      },
      {
        id: "tour_canto",
        group: "4. Noite / dia em Atins",
        label: "Passeio Canto do Atins (lagoas)",
        pp: 190,
        defaultOn: plan === "atins",
        plans: ["atins"],
        meta: "Maventur ~R$ 190 · Lagoa do Kite, Gavião, Maria Vitória · ~4h. Recomendado no dia 04.",
      },
      {
        id: "tour_mangue",
        group: "4. Noite / dia em Atins",
        label: "Alt: Ponta do Mangue (em vez do Canto)",
        pp: 190,
        defaultOn: false,
        plans: ["atins"],
        meta: "Esmeralda, Gorjeta, Tropical · ~R$ 190. Marque um OU outro, não os dois no mesmo dia.",
      },
      {
        id: "tour_dia_inteiro",
        group: "4. Noite / dia em Atins",
        label: "Alt: Dia inteiro Canto + Mangue",
        pp: 280,
        defaultOn: false,
        plans: ["atins"],
        meta: "Maventur ~R$ 280. Se marcar este, desmarque Canto/Mangue isolados.",
      },
      {
        id: "tour_guaras",
        group: "4. Noite / dia em Atins",
        label: "Opcional: Revoada dos Guarás (lancha)",
        pp: 190,
        defaultOn: false,
        plans: ["atins"],
        meta: "~3h · fim de tarde. Combina com noite na vila; confirme horário da maré.",
      },
      {
        id: "transfer_jeri_shared",
        group: "5. Lençóis → Jericoacoara",
        label: "Transfer compartilhado Rota Combo",
        pp: 480,
        defaultOn: plan === "direto",
        meta: "Ter/qui/sáb ~9–10h · ~R$ 460–495. Ideal no plano DIRETO (sáb 08/08).",
      },
      {
        id: "transfer_jeri_private",
        group: "5. Lençóis → Jericoacoara",
        label: "Transfer privativo (carro ÷ 2)",
        pp: 930,
        defaultOn: plan === "atins",
        meta: "Rota Combo privativo ~R$ 1.860 até 3 pess. = R$ 930/pess. Necessário no plano ATINS se quiserem sair no fim de semana.",
      },
      {
        id: "hotel_sa",
        group: "5. Lençóis → Jericoacoara",
        label: "Pernoite Santo Amaro / BRR pós-trek",
        pp: s.hotelSa,
        defaultOn: true,
        meta: "Plano direto: noite 07 em SA. Plano Atins: noite 08 em SA (antes do privativo domingo) — ajuste se forem direto.",
      },
      {
        id: "hotel_jeri",
        group: "6. Jericoacoara",
        label: `Pousada Jeri (${jeriN} noites)`,
        pp: s.hotelJeriNight * jeriN,
        defaultOn: true,
        meta: `Cenário ${s.label}: ~${money(s.hotelJeriNight)}/noite/pessoa × ${jeriN}.`,
      },
      {
        id: "tts",
        group: "6. Jericoacoara",
        label: "TTS municipal (obrigatória)",
        pp: 42,
        defaultOn: true,
        meta: "Só canal oficial ADEJERI. Valor de referência ~R$ 41,50.",
      },
      {
        id: "food_jeri",
        group: "6. Jericoacoara",
        label: "Comida em Jeri (dias fora da trilha)",
        pp: Math.round(s.foodDay * (jeriN + 0.5)),
        defaultOn: true,
        meta: "Estimativa; na trilha comida = R$ 0.",
      },
      {
        id: "jeri_leste_buggy",
        group: "6. Jericoacoara · Lado Leste (casal)",
        label: "Buggy Leste privativo (÷2) — COOPBJ/Oba",
        pp: 250,
        defaultOn: true,
        meta: "COOPBJ R$ 500/buggy ÷ 2 = R$ 250. Circuito Paraíso ~6h. É a “rota romântica” de Jeri.",
      },
      {
        id: "jeri_entradas_leste",
        group: "6. Jericoacoara · Lado Leste (casal)",
        label: "Entradas beach clubs Leste (média)",
        pp: 80,
        defaultOn: true,
        meta: "Azul+Buraco+ éventual Alchymist — espécie no local (COOPBJ lista R$ 30–50/parada).",
      },
      {
        id: "jeri_oeste",
        group: "6. Jericoacoara · Lado Leste (casal)",
        label: "Opcional: Buggy Oeste (÷2)",
        pp: 250,
        defaultOn: false,
        meta: "~R$ 450–500/buggy. Tatajuba, balsa — 2º dia se sobrar energia/orçamento.",
      },
      {
        id: "jeri_jardineira",
        group: "6. Jericoacoara · Lado Leste (casal)",
        label: "Alt barata: Leste em jardineira compartilhada",
        pp: 100,
        defaultOn: false,
        meta: "~R$ 80–140/pessoa. Se marcar, desmarque buggy privativo.",
      },
      {
        id: "hotel_for",
        group: "7. Fortaleza (proteger voo)",
        label: "Hotel Fortaleza noite 12/08",
        pp: s.hotelFor,
        defaultOn: true,
        meta: "Fortemente recomendado. Van compartilhada Jeri~10:30 chega ~18h — perde o voo 12:50.",
      },
      {
        id: "transfer_jeri_for",
        group: "7. Fortaleza (proteger voo)",
        label: "Transfer Jeri → Fortaleza (compartilhado dia 12)",
        pp: 120,
        defaultOn: true,
        meta: "~R$ 90–150/pessoa · saída tarde do dia 12. NÃO usar no dia 13 de manhã.",
      },
      {
        id: "uber_for",
        group: "7. Fortaleza (proteger voo)",
        label: "Uber/táxi hotel → aeroporto FOR",
        pp: 40,
        defaultOn: true,
        meta: "Manhã do dia 13 · folga para check-in do voo 12:50.",
      },
      {
        id: "seguro",
        group: "8. Extras",
        label: "Seguro viagem com trekking",
        pp: 90,
        defaultOn: true,
        meta: "Cobertura aventura/trekking — ler exclusões de dunas.",
      },
      {
        id: "chip",
        group: "8. Extras",
        label: "Chip / eSIM dados",
        pp: 40,
        defaultOn: true,
        meta: "Vivo costuma ter melhor sinal na região; oásis ficam sem sinal.",
      },
      {
        id: "agua_oasis",
        group: "8. Extras",
        label: "Água/bebidas nos oásis (espécie)",
        pp: 60,
        defaultOn: true,
        meta: "Comida inclusa; água engarrafada e refrigerante à parte.",
      },
      {
        id: "imprevistos",
        group: "8. Extras",
        label: "Colchão de imprevisto",
        pp: 150,
        defaultOn: true,
        meta: "Van atrasada, privativo emergencial, gorjetas.",
      },
      {
        id: "food_buffer",
        group: "8. Extras",
        label: "Ajuste comida fora da trilha (cenário)",
        pp: Math.max(0, Math.round(foodNonTrek * 0.15)),
        defaultOn: false,
        meta: "Só se quiserem margem extra de restaurante.",
      },
    ].filter((item) => !item.plans || item.plans.includes(plan));
  }

  const PLANS = {
    atins: {
      title: "Plano A — Com noite em Atins (04/08)",
      short: "Atins + trilha 05–08",
      why: "Vocês dormem 03 em Barreirinhas (obrigatório), fazem lancha 12:30 no dia 04, exploram Atins à tarde/noite e só encontram o Walter na manhã do dia 05. Mais calmo, conhecem a vila — mas o trek termina no sábado 08/08 e o compartilhado Rota Combo da manhã já saiu.",
      impact: [
        "Trek: qua 05 → sáb 08 (4 dias completos).",
        "Fim em Santo Amaro no sábado — transfer compartilhado BRR→Jeri (~9–10h) já partiu.",
        "Solução padrão deste plano: privativo sáb à tarde OU domingo 09/08 (~R$ 930/pessoa no rateio do casal), ou esperar terça 11/08 (mata Jeri).",
        "Jeri fica com ~3 noites úteis se chegarem domingo à noite (09–11) e saírem dia 12 para FOR.",
        "Custo extra vs plano direto: pousada Atins + comida/passeio dia 04 + provavelmente privativo em vez de compartilhado (~+R$ 450–900/pessoa).",
        "Dia 04 comida NÃO está no Walter — só a partir do início da trilha.",
      ],
      rows: [
        ["03/08", "seg", "POA 04:45 → SLZ 10:45 · van ~12:30 → Barreirinhas · jantar + ATM", "Barreirinhas"],
        ["04/08", "ter", "Lancha ~12:30 → Atins · tarde: Canto do Atins / vila / pôr do sol · NÃO inicia trilha", "Atins"],
        ["05/08", "qua", "Encontro Walter em Atins · trilha → Baixa Grande (comida inclusa)", "Baixa Grande"],
        ["06/08", "qui", "Travessia → Queimada dos Britos (comida inclusa)", "Queimada"],
        ["07/08", "sex", "Travessia → Betânia — dia mais longo (comida inclusa)", "Betânia"],
        ["08/08", "sáb", "Travessia → Santo Amaro · fim do trek · (compartilhado Jeri já saiu de manhã)", "Santo Amaro"],
        ["09/08", "dom", "Privativo SA/BRR → Jeri (recomendado) · chegada fim de tarde/noite", "Jeri"],
        ["10/08", "seg", "Descanso · duna do pôr do sol", "Jeri"],
        ["11/08", "ter", "Lado Leste — Lagoa do Paraíso (buggy/jardineira)", "Jeri"],
        ["12/08", "qua", "Manhã livre / Pedra Furada · transfer tarde → Fortaleza", "Fortaleza"],
        ["13/08", "qui", "Uber aeroporto · FOR 12:50 → POA 18:50", "POA"],
      ],
    },
    direto: {
      title: "Plano B — Sem noite em Atins (trilha no dia 04)",
      short: "Trilha desde 04 tarde",
      why: "Mesma chegada: noite 03 em BRR + lancha 12:30 no dia 04. Em vez de explorar Atins, encontram o Walter ~14h e caminham Atins→Baixa Grande no mesmo dia. Ganha o sábado 08/08 para o transfer compartilhado Rota Combo (malha ter/qui/sáb).",
      impact: [
        "Trek: ter 04 tarde → sex 07 (ainda são 4 dias de pacote, começando à tarde).",
        "Sábado 08/08 livre para Rota Combo compartilhado ~9–10h — encaixa perfeito.",
        "Economiza pousada Atins + passeio do dia 04 + tende a evitar privativo (~economia R$ 400–900/pessoa).",
        "Vocês quase não “conhecem” a vila de Atins — só o porto e o início da trilha.",
        "Confirmem com Walter se aceita início ~14h após a lancha das 12:30.",
      ],
      rows: [
        ["03/08", "seg", "POA→SLZ 10:45 · van → Barreirinhas · ATM + jantar", "Barreirinhas"],
        ["04/08", "ter", "Lancha ~12:30 → Atins · encontro Walter · trilha tarde → Baixa Grande (comida inclusa)", "Baixa Grande"],
        ["05/08", "qua", "→ Queimada dos Britos (comida inclusa)", "Queimada"],
        ["06/08", "qui", "→ Betânia (comida inclusa)", "Betânia"],
        ["07/08", "sex", "→ Santo Amaro · fim · eventual deslocamento BRR", "Santo Amaro / BRR"],
        ["08/08", "sáb", "Rota Combo compartilhado → Jeri (~9–10h · ~7h30)", "Jeri"],
        ["09/08", "dom", "Descanso obrigatório · duna", "Jeri"],
        ["10/08", "seg", "Lado Leste — Paraíso", "Jeri"],
        ["11/08", "ter", "Pedra Furada (maré) ou Oeste", "Jeri"],
        ["12/08", "qua", "Manhã Jeri · transfer → Fortaleza", "Fortaleza"],
        ["13/08", "qui", "FOR 12:50 → POA 18:50", "POA"],
      ],
    },
  };

  const TABS = [
    { id: "visao", label: "Visão geral" },
    { id: "planos", label: "Dois planos" },
    { id: "dias", label: "Dia a dia" },
    { id: "travessia", label: "Travessia" },
    { id: "jeri", label: "Rota Leste / casal" },
    { id: "orcamento", label: "Orçamento ✓" },
    { id: "fornecedores", label: "Fornecedores" },
    { id: "viabilidade", label: "Viabilidade" },
    { id: "prazos", label: "Prazos" },
    { id: "checklist", label: "Checklist" },
    { id: "dicas", label: "Dicas" },
  ];

  const SEG_COLORS = {
    outbound: "#0a5554",
    inbound: "#0e8a86",
    trek: "#3ecfc4",
    ground: "#b8956a",
    hotels: "#d9c4a0",
    food: "#5aa9a6",
    tours: "#7eb8b5",
    extras: "#8aa8a5",
  };

  const DEFAULT_TASKS = {
    chkWalter: false,
    chkLancha: false,
    chkVan: false,
    chkHotelBrr: false,
    chkHotelAtins: false,
    chkTransferJeri: false,
    chkHotelJeri: false,
    chkFor: false,
    chkTts: false,
    chkSeguro: false,
    chkCash: false,
  };

  function money(n) {
    return `R$ ${Math.round(n).toLocaleString("pt-BR")}`;
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
    plan: saved?.plan || "atins",
    jeriNights: String(saved?.jeriNights ?? "3"),
    trekMode: saved?.trekMode || "cotacao",
    tab: saved?.tab || "visao",
    notes: saved?.notes || "",
    tasks: { ...DEFAULT_TASKS, ...(saved?.tasks || {}) },
    lines: saved?.lines || null,
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

  function catalog() {
    return buildCatalog(
      state.scenario,
      state.plan,
      state.trekMode,
      state.jeriNights
    );
  }

  function lineOn(id, item) {
    if (state.lines && Object.prototype.hasOwnProperty.call(state.lines, id)) {
      return !!state.lines[id];
    }
    return !!item.defaultOn;
  }

  function ensureLinesForPlan() {
    const items = catalog();
    if (!state.lines) state.lines = {};
    // When plan changes, reset plan-specific defaults if never touched — keep user toggles for shared ids
    items.forEach((item) => {
      if (item.plans && !Object.prototype.hasOwnProperty.call(state.lines, item.id)) {
        state.lines[item.id] = !!item.defaultOn;
      }
    });
  }

  function budgetFromLines() {
    ensureLinesForPlan();
    const items = catalog();
    const active = items.filter((i) => lineOn(i.id, i));
    const total = active.reduce((a, i) => a + i.pp, 0);
    const byGroup = {};
    active.forEach((i) => {
      byGroup[i.group] = (byGroup[i.group] || 0) + i.pp;
    });
    // Aggregate for usage bar
    const buckets = {
      outbound: 0,
      inbound: 0,
      trek: 0,
      ground: 0,
      hotels: 0,
      food: 0,
      tours: 0,
      extras: 0,
    };
    active.forEach((i) => {
      if (i.id === "outbound") buckets.outbound += i.pp;
      else if (i.id === "inbound") buckets.inbound += i.pp;
      else if (i.id === "trek" || i.id === "food_trek_zero") buckets.trek += i.pp;
      else if (
        i.id.startsWith("hotel") ||
        i.id === "hotel_jeri" ||
        i.id === "hotel_for" ||
        i.id === "hotel_brr_03" ||
        i.id === "hotel_atins_04" ||
        i.id === "hotel_sa"
      )
        buckets.hotels += i.pp;
      else if (i.id.startsWith("food") || i.id === "food_buffer") buckets.food += i.pp;
      else if (
        i.id.startsWith("tour") ||
        i.id.startsWith("jeri_") ||
        i.id === "tts"
      )
        buckets.tours += i.pp;
      else if (
        i.id === "seguro" ||
        i.id === "chip" ||
        i.id === "agua_oasis" ||
        i.id === "imprevistos"
      )
        buckets.extras += i.pp;
      else buckets.ground += i.pp;
    });
    return {
      items: active,
      all: items,
      total,
      remaining: CAP - total,
      byGroup,
      buckets,
      why: SCENARIO[state.scenario].why,
    };
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

  function renderMenuGroups(budget) {
    const groups = [];
    const map = new Map();
    budget.all.forEach((item) => {
      if (!map.has(item.group)) {
        map.set(item.group, []);
        groups.push(item.group);
      }
      map.get(item.group).push(item);
    });
    return groups
      .map((g) => {
        const list = map.get(g);
        const sum = list.reduce((a, i) => a + (lineOn(i.id, i) ? i.pp : 0), 0);
        const rows = list
          .map((item) => {
            const on = lineOn(item.id, item);
            const locked = item.locked
              ? "disabled"
              : "";
            return `
            <label class="menu-item ${on ? "" : "is-off"} ${item.locked ? "locked" : ""}">
              <input type="checkbox" data-line="${item.id}" ${on ? "checked" : ""} ${locked} />
              <span>
                <b>${item.label}</b>
                <div class="menu-item__meta">${item.meta || ""}</div>
              </span>
              <span class="menu-item__price">${money(item.pp)}</span>
            </label>`;
          })
          .join("");
        return `
          <div class="menu-group">
            <div class="menu-group__head">
              <h4>${g}</h4>
              <span class="menu-group__sum">${money(sum)}</span>
            </div>
            <div class="menu-group__body">${rows}</div>
          </div>`;
      })
      .join("");
  }

  function renderStats(budget) {
    const over = budget.remaining < 0;
    const tight = !over && budget.remaining < 250;
    const tone = over ? "alert" : tight ? "warn" : "ok";
    els.stats.innerHTML = `
      <div class="stat stat--${tone}">
        <div class="stat__value">${money(budget.total)}</div>
        <div class="stat__label">Total / pessoa · checklist vivo</div>
      </div>
      <div class="stat stat--${tone}">
        <div class="stat__value">${money(Math.abs(budget.remaining))}</div>
        <div class="stat__label">${over ? "Acima do teto" : "Folga no teto"}</div>
      </div>
      <div class="stat">
        <div class="stat__value">${PLANS[state.plan].short}</div>
        <div class="stat__label">Plano ativo</div>
      </div>
      <div class="stat stat--info">
        <div class="stat__value">${money(OUTBOUND_PAID + RETURN_PAID)}</div>
        <div class="stat__label">Voos já pagos / pessoa</div>
      </div>
    `;
  }

  function renderUsage(budget) {
    const pct = Math.min(100, Math.round((budget.total / CAP) * 100));
    const segs = [
      ["outbound", "Ida"],
      ["inbound", "Volta"],
      ["trek", "Trek"],
      ["ground", "Transfers"],
      ["hotels", "Hotéis"],
      ["food", "Comida"],
      ["tours", "Passeios"],
      ["extras", "Extras"],
    ];
    const bars = segs
      .map(([id]) => {
        const w = Math.max(0, (budget.buckets[id] / CAP) * 100);
        return `<div class="usage__seg" style="width:${w}%;background:${SEG_COLORS[id]}"></div>`;
      })
      .join("");
    const legend = segs
      .map(
        ([id, label]) =>
          `<span><i style="background:${SEG_COLORS[id]}"></i>${label} ${money(budget.buckets[id])}</span>`
      )
      .join("");
    els.usage.innerHTML = `
      <div class="usage__head">
        <span>${pct}% do teto · marque/desmarque itens na aba Orçamento</span>
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
    return `
      <section class="section is-active">
        <h2>O que está decidido — e o que o Walter inclui</h2>
        <p class="lede">Teto ${money(CAP)}/pessoa com os dois aviões. Travessia cotada a ${money(TREK_QUOTE)}. Alimentação nos dias de trilha = R$ 0 extra. Lancha até Atins = conta de vocês.</p>

        ${table(
          ["Item", "Detalhe", "No teto?"],
          [
            ["Ida LATAM", "03/08 · POA 04:45 → SLZ 10:45", money(OUTBOUND_PAID) + " sim"],
            ["Volta Azul", "13/08 · FOR 12:50 → POA 18:50", money(RETURN_PAID) + " sim"],
            ["Walter", "Encontro Atins · 4 dias · comida na trilha", money(TREK_QUOTE) + " sim"],
            ["Lancha BRR→Atins", "Satur/K-Beça ~12:30 · fora do Walter", "~R$ 100 · sim"],
          ],
          { tones: ["ok", "ok", "ok", "warn"] }
        )}

        ${explain(
          "Regra clara do guia",
          " O Walter <b>não paga</b> a lancha Barreirinhas→Atins. Ele encontra vocês <b>em Atins</b> e a partir daí começa a trilha. Reservem Satur ou K-Beça (aba Fornecedores). Nos dias de caminhada, café/almoço/jantar dos oásis estão no pacote — não orcem restaurante nesses dias."
        )}

        <div class="compare-grid">
          <div class="block">
            <div class="block__title">Plano A — noite em Atins</div>
            <p>Exploram a vila no dia 04. Trilha 05–08. Transfer Jeri tende a ser <b>privativo</b>. Mais completo emocionalmente; ~R$ 450–900 a mais/pessoa.</p>
            <p class="muted">Selecionado no menu se escolherem “Com noite em Atins”.</p>
          </div>
          <div class="block">
            <div class="block__title">Plano B — trilha no dia 04</div>
            <p>Lancha 12:30 e já entram na areia. Terminam sex 07 → compartilhado sáb 08. Mais barato e encaixa na malha Rota Combo.</p>
          </div>
        </div>

        ${explain(
          "Veredito autônomo (recomendação)",
          state.plan === "atins"
            ? " Vocês marcaram interesse em Atins — <b>mantenham o Plano A</b>, mas já orcem o <b>privativo domingo 09/08</b> (ligado no checklist) e 3 noites em Jeri. Não contem com o compartilhado do sábado de manhã."
            : " Plano B é o que melhor casa com horários e teto. Se quiserem a vila de Atins, voltem ao Plano A e aceitem o privativo."
        )}

        <p class="muted">Total atual do checklist: <b>${money(budget.total)}</b> · folga <b>${money(budget.remaining)}</b>. Ajuste fininho na aba <b>Orçamento ✓</b>.</p>
      </section>`;
  }

  function sectionPlanos() {
    const a = PLANS.atins;
    const b = PLANS.direto;
    return `
      <section class="section is-active">
        <h2>Dois planos obrigatórios — impacto lado a lado</h2>
        <p class="lede">Ambos começam iguais: noite 03 em Barreirinhas (sem escape). A bifurcação é o que fazem depois da lancha das 12:30 do dia 04.</p>

        <div class="compare-grid">
          <div class="block">
            <div class="block__title">${a.title}</div>
            <p>${a.why}</p>
            <div class="impact-box">
              <strong>Impactos</strong>
              <ul>${a.impact.map((x) => `<li>${x}</li>`).join("")}</ul>
            </div>
          </div>
          <div class="block">
            <div class="block__title">${b.title}</div>
            <p>${b.why}</p>
            <div class="impact-box">
              <strong>Impactos</strong>
              <ul>${b.impact.map((x) => `<li>${x}</li>`).join("")}</ul>
            </div>
          </div>
        </div>

        <h3>Calendário do plano ativo: ${PLANS[state.plan].title}</h3>
        ${table(["Data", "Dia", "Roteiro", "Pernoite"], PLANS[state.plan].rows)}

        <h3>O que fazer no dia 04 em Atins (só Plano A)</h3>
        <div class="day-card">
          <h3>Manhã em Barreirinhas</h3>
          <p>Café na pousada · sacar dinheiro (último ATM confiável) · deixar mala grande se o Walter combinar ponto em BRR/SA · estar no porto ~11:45–12:00.</p>
        </div>
        <div class="day-card">
          <h3>~12:30–14:00 · Lancha → Atins</h3>
          <p>Satur ou K-Beça (~R$ 70–150/pess.). Paisagem do Rio Preguiças. Transfer até a pousada costuma vir no bilhete — confirmem.</p>
        </div>
        <div class="day-card">
          <h3>Tarde · escolher UM eixo (checklist no Orçamento)</h3>
          <ul>
            <li><b>Canto do Atins (~R$ 190 · Maventur)</b> — lagoas + almoço de camarão no Canto (~R$ 45). Clássico “entender Atins”.</li>
            <li><b>Ponta do Mangue (~R$ 190)</b> — Esmeralda/Tropical; mais “parque”.</li>
            <li><b>Dia inteiro (~R$ 280)</b> — Canto + Mangue se tiverem fôlego antes da trilha.</li>
            <li><b>Vila a pé (grátis)</b> — rua de areia, kite na praia, pôr do sol, jantar leve. Válido se quiserem economizar pernas.</li>
            <li><b>Guarás (~R$ 190 · fim de tarde)</b> — só se a maré/horário bater; não façam se estiverem exaustos.</li>
          </ul>
        </div>
        <div class="day-card">
          <h3>Noite · Atins</h3>
          <p>Dormir cedo. Dia 05 o Walter busca vocês — saída típica de madrugada/manhã cedo. Mochila de trilha pronta; mala grande já encaminhada.</p>
        </div>

        ${explain(
          "Dica de casal",
          " Se o desejo de “entender Atins” for forte, Plano A vale o privativo. Se a prioridade for lagoas remotas da travessia + Jeri barato no sábado, Plano B. Não misturem os dois sem redesenhar o transfer."
        )}
      </section>`;
  }

  function sectionDias() {
    const plan = state.plan;
    const daysDireto = `
      <div class="day-card"><h3>03/08 — Barreirinhas</h3>
        <p><b>Custos típicos/pessoa:</b> van ${money(130)} · pousada ${money(SCENARIO[state.scenario].hotelBrr)} · comida ~${money(Math.round(SCENARIO[state.scenario].foodDay * 1.3))}.</p>
        <p><b>Fornecedor:</b> Kairós Tur (WA 98 98852-7434). <b>Dica:</b> sacar no aeroporto ou BRR; avisar van se o desembarque atrasar.</p>
      </div>
      <div class="day-card"><h3>04/08 — Lancha + início trilha</h3>
        <p><b>Custos:</b> lancha ~${money(100)} · comida na trilha R$ 0 (Walter). <b>Fornecedor lancha:</b> Satur 99232-8780 / K-Beça 98827-7715.</p>
        <p><b>Por quê à tarde:</b> coletiva só ~12:30. Chegam ~14h e caminham Atins→Baixa Grande.</p>
      </div>
      <div class="day-card"><h3>05–07/08 — Trilha</h3>
        <p><b>Custo comida:</b> R$ 0. Água/bebida ~${money(20)}/dia nos oásis. Sem restaurante externo.</p>
      </div>
      <div class="day-card"><h3>08/08 — Transfer Jeri</h3>
        <p><b>Rota Combo compartilhado</b> ~${money(480)} · WA 86 99993-0111 · saída ~9–10h. Chegada Jeri fim de tarde.</p>
      </div>`;

    const daysAtins = `
      <div class="day-card"><h3>03/08 — Barreirinhas (igual nos dois planos)</h3>
        <p>Van Kairós ~${money(130)} · pousada · jantar. ATM obrigatório.</p>
      </div>
      <div class="day-card"><h3>04/08 — Dia Atins (sem Walter ainda)</h3>
        <p><b>Lancha</b> ~${money(100)} · <b>pousada Atins</b> ~${money(SCENARIO[state.scenario].hotelAtins)} · <b>passeio Canto</b> ~${money(190)} · <b>comida</b> ~${money(Math.round(SCENARIO[state.scenario].foodDay * 1.4))} (não inclusa).</p>
        <p><b>Fornecedores:</b> Satur/K-Beça + Maventur (maventur.com.br/passeios-em-atins). Alternativas no Orçamento (desmarque o que não for fazer).</p>
        <p><b>Roteiro sugerido:</b> 12:30 lancha → check-in → 14:30–18:00 Canto do Atins → camarão → pôr do sol na praia → dormir.</p>
      </div>
      <div class="day-card"><h3>05–08/08 — Trilha (comida inclusa)</h3>
        <p>Walter em Atins na manhã do 05. Termina <b>sábado 08</b> em Santo Amaro. Comida R$ 0.</p>
      </div>
      <div class="day-card"><h3>09/08 — Privativo → Jeri</h3>
        <p><b>~${money(930)}/pessoa</b> (R$ 1.860/carro ÷ 2) · Rota Combo privativo. Por quê: compartilhado só ter/qui/sáb de manhã — no sábado vocês ainda estão terminando a trilha.</p>
      </div>`;

    return `
      <section class="section is-active">
        <h2>Dia a dia — preços e fornecedores do plano ativo</h2>
        <p class="lede">${PLANS[plan].title}. Use a aba Orçamento para ligar/desligar cada linha. Detalhes de contato na aba Fornecedores.</p>
        ${plan === "atins" ? daysAtins : daysDireto}
        <div class="day-card">
          <h3>Jeri (dias úteis) + Fortaleza</h3>
          <p><b>Leste COOPBJ</b> R$ 500/buggy (= ${money(250)}/pess.) + entradas ~${money(80)}. TTS ~${money(42)}. Hotel FOR noite 12 ~${money(SCENARIO[state.scenario].hotelFor)}. Transfer Jeri→FOR dia 12 ~${money(120)}.</p>
          <p>Roteiro romântico detalhado na aba <b>Rota Leste / casal</b>.</p>
        </div>
        ${table(
          ["Data", "Dia", "Plano", "Pernoite"],
          PLANS[plan].rows
        )}
      </section>`;
  }

  function sectionTravessia() {
    const start =
      state.plan === "atins"
        ? [
            ["05/08", "Atins → Baixa Grande", "Encontro manhã · 4×4 bandeira + ~13 km", "Comida inclusa"],
            ["06/08", "→ Queimada", "~10 km", "Comida inclusa"],
            ["07/08", "→ Betânia", "~17 km · dia duro", "Comida inclusa"],
            ["08/08", "→ Santo Amaro", "~10 km · fim", "Comida inclusa · transfer Jeri = outro dia"],
          ]
        : [
            ["04/08 tarde", "Atins → Baixa Grande", "Após lancha 12:30", "Comida inclusa"],
            ["05/08", "→ Queimada", "~10 km", "Comida inclusa"],
            ["06/08", "→ Betânia", "~17 km", "Comida inclusa"],
            ["07/08", "→ Santo Amaro", "Fim", "Comida inclusa · transfer sáb 08"],
          ];
    return `
      <section class="section is-active">
        <h2>Travessia — Walter</h2>
        <p class="lede">R$ 2.100/pessoa. Encontro em Atins. Alimentação dos dias de trilha inclusa. Lancha até Atins: conta de vocês (~R$ 100).</p>
        <div class="grid-2">
          <div class="block">
            <div class="block__title">Incluso no Walter</div>
            <ul>
              <li>Guia a partir de Atins</li>
              <li>3 noites em redário/oásis</li>
              <li>Café, almoço e jantar nos dias de trilha</li>
              <li>4×4 internos da travessia (conforme pacote)</li>
            </ul>
          </div>
          <div class="block">
            <div class="block__title">Fora do Walter (checklist)</div>
            <ul>
              <li>Lancha Barreirinhas → Atins</li>
              <li>Van SLZ → Barreirinhas</li>
              <li>Pousada Atins (só Plano A)</li>
              <li>Transfer Santo Amaro/BRR → Jeri</li>
              <li>Água engarrafada / bebidas</li>
            </ul>
          </div>
        </div>
        <h3>Cronograma no plano ${state.plan === "atins" ? "A (Atins)" : "B (direto)"}</h3>
        ${table(["Quando", "Trecho", "O que acontece", "Comida"], start)}
        ${explain(
          "Perguntas ao Walter agora",
          " 1) Aceita início dia 04 ~14h (Plano B) OU encontro manhã 05 em Atins (Plano A)? 2) Onde deixa a mala grande? 3) Horário de chegada em Santo Amaro no último dia? 4) Grupo mínimo com 2 pessoas? 5) Cancelamento/seguro?"
        )}
      </section>`;
  }

  function sectionJeri() {
    return `
      <section class="section is-active">
        <h2>Rota de casal em Jeri = Lado Leste (não é a Rota Romântica do RS)</h2>
        <p class="lede">A “Rota Romântica” oficial é gaúcha. Em Jericoacoara o circuito de casal é o <b>Litoral Leste</b>: Árvore da Preguiça → Preá → Buraco Azul → Lagoa Azul → <b>Lagoa do Paraíso</b> → Amâncio. Preços abaixo vêm de COOPBJ, Oba Jeri, TourFácil e Maventur (jul/2026).</p>

        ${explain(
          "Como usar os checklists",
          " Cada opção está na aba <b>Orçamento ✓</b> para ligar/desligar. Aqui está o roteiro detalhado com o que está incluso e o que se paga no local."
        )}

        <h3>Roteiro Leste detalhado (~6 horas)</h3>
        ${table(
          ["Parada", "O que fazer", "Taxa local (ref.)", "Dica de casal"],
          [
            ["Árvore da Preguiça", "Foto clássica na chegada do circuito", "—", "5–10 min bastam"],
            ["Praia do Preá", "Mar aberto, kite ao longe", "—", "Não precisa demorar"],
            ["Buraco Azul (Caiçara)", "Poço de água doce na vegetação", "~R$ 30/pess.", "Leve espécie"],
            ["Lagoa Azul", "Banho + decks", "~R$ 40/pess.", "Menos cheia que Paraíso"],
            ["Lagoa do Paraíso", "Redes na água · almoço · o cartão-postal", "Consumação no beach club", "Prioridade #1 do dia"],
            ["Lagoa do Amâncio / dunas", "Fechamento + fotos", "Varia", "Pôr do sol se o buggy oferecer"],
          ]
        )}

        <h3>Fornecedores e preços (por buggy até 4 pessoas)</h3>
        ${table(
          ["Fornecedor", "Preço buggy", "≈ / pessoa (casal)", "Link / nota"],
          [
            ["COOPBJ", "R$ 500", money(250), "coopbjj.com.br/leste · privativo"],
            ["Oba Jeri", "a partir R$ 399", money(200), "obajeri.com.br"],
            ["TourFácil", "a partir R$ 450", money(225), "tourfacil.com.br"],
            ["Maventur", "a partir R$ 600", money(300), "maventur.com.br"],
            ["Jardineira compartilhada", "—", "R$ 80–140", "Mais barato; menos privacidade"],
          ],
          { aligns: ["left", "right", "right", "left"], tones: ["ok", "ok", "info", "warn", "info"] }
        )}

        <h3>Roteiro sugerido nos dias de Jeri</h3>
        ${table(
          ["Dia", "Plano romântico", "Custo tip. / pessoa", "Checklist"],
          [
            ["Chegada", "Só pousada + jantar leve + duna se der", "comida + TTS", "TTS na chegada"],
            ["Dia cheio 1", "Leste buggy privativo + Paraíso", money(250 + 80), "Ligue buggy + entradas"],
            ["Dia cheio 2", "Pedra Furada a pé (maré baixa) OU Oeste", "R$ 0 ou ~" + money(250), "Oeste opcional no Orçamento"],
            ["Última manhã", "Café + praia · transfer FOR à tarde", money(120) + " transfer", "Hotel FOR noite 12"],
          ]
        )}

        <div class="grid-2">
          <div class="block">
            <div class="block__title">O que levar no buggy</div>
            <ul>
              <li>Dinheiro em espécie para entradas</li>
              <li>Protetor, chapéu, canga, água</li>
              <li>PIX funciona em vários clubs — não em todos</li>
              <li>Protetor solar reef-safe se possível</li>
            </ul>
          </div>
          <div class="block">
            <div class="block__title">O que pular se o teto apertar</div>
            <ul>
              <li>Segundo buggy (Oeste)</li>
              <li>Alchymist (entrada cara)</li>
              <li>Trocar buggy por jardineira (~economia R$ 100–150/pess.)</li>
            </ul>
          </div>
        </div>
      </section>`;
  }

  function sectionOrcamento(budget) {
    return `
      <section class="section is-active">
        <h2>Orçamento com checklist — ligue ou desligue cada opção</h2>
        <p class="lede">Tudo que está marcado soma no teto de ${money(CAP)}. Comida da trilha aparece como R$ 0 de propósito. Plano ativo: <b>${PLANS[state.plan].short}</b>.</p>
        ${explain(
          "Como usar",
          " Cada submenu abaixo é um grupo. Desmarque o que não vão contratar — o total do topo atualiza na hora e fica salvo neste navegador."
        )}
        ${renderMenuGroups(budget)}
        <div class="block" style="margin-top:1rem">
          <div class="block__title">Totais</div>
          <p>Selecionado: <b>${money(budget.total)}</b> / pessoa · Casal ×2 ≈ <b>${money(budget.total * 2)}</b> · Folga: <b>${money(budget.remaining)}</b></p>
          <p class="muted">${budget.why}</p>
          <button type="button" class="btn btn--soft btn--sm" id="resetLines">Restaurar padrões deste plano</button>
        </div>
      </section>`;
  }

  function sectionFornecedores() {
    const cards = SUPPLIERS.map((s) => {
      const links = (s.links || [])
        .map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`)
        .join("");
      return `
        <div class="supplier-card" id="sup-${s.id}">
          <h4>${s.name}</h4>
          <p class="muted">${s.category}</p>
          <p>${s.what}</p>
          <p><b>Valores:</b> ${s.price}</p>
          <p><b>Contato:</b> ${s.contact}</p>
          ${links ? `<div class="links">${links}</div>` : ""}
          <p class="menu-item__meta"><b>Dica:</b> ${s.tips}</p>
        </div>`;
    }).join("");

    return `
      <section class="section is-active">
        <h2>Anexo — Fornecedores (contatos, páginas, valores)</h2>
        <p class="lede">Lista operacional para reservar. Preços de mercado jul/2026 — confirmem no WhatsApp antes de pagar. Nada de códigos de reserva pessoais neste site.</p>
        ${table(
          ["Categoria", "Fornecedor", "Valor ref.", "Contato rápido"],
          SUPPLIERS.map((s) => [
            s.category,
            s.name.split("—")[0].trim(),
            s.price,
            s.contact.split("·")[0].trim(),
          ])
        )}
        ${cards}
      </section>`;
  }

  function sectionViabilidade() {
    return `
      <section class="section is-active">
        <h2>Viabilidade de horários</h2>
        ${table(
          ["Gargalo", "Fato", "Decisão"],
          [
            ["03/08 SLZ 10:45", "Lancha Atins ~12:30 em BRR", "Noite 03 em Barreirinhas — inevitável"],
            ["04/08 lancha", "Coletiva ~12:30 Satur/K-Beça", "Chegada Atins ~14h"],
            ["Plano A fim trek", "Sábado 08 em Santo Amaro", "Compartilhado 9h já saiu → privativo"],
            ["Plano B fim trek", "Sexta 07 em SA", "Compartilhado sábado 08 ok"],
            ["13/08 FOR 12:50", "Van Jeri 10:30 chega ~18h", "Hotel FOR noite 12"],
          ],
          { tones: ["alert", "ok", "warn", "ok", "alert"] }
        )}
        ${explain(
          "Lancha máxima",
          " A coletiva confiável é ~12:30. Existe ~16:00 sazonal (Memory Tur) — plano B, não âncora. Privativo de lancha existe mas come o orçamento."
        )}
      </section>`;
  }

  function sectionPrazos() {
    return `
      <section class="section is-active">
        <h2>Ordem de ação</h2>
        ${table(
          ["#", "Ação", "Prazo", "Por quê"],
          [
            ["1", "Fechar Plano A ou B com o Walter (data de encontro)", "Agora", "Muda oásis e transfer Jeri"],
            ["2", "Reservar lancha 04/08 12:30 (Satur ou K-Beça)", "Com o trek", "Conta de vocês — fora do Walter"],
            ["3", "Van Kairós 03/08 12:30 (+B 17:30)", "Esta semana", "Chegada 10:45 justa"],
            ["4", state.plan === "atins" ? "Pousada Atins 04 + passeio Canto" : "Só alinhar encontro 04 tarde", "Já", "Plano A precisa de cama em Atins"],
            ["5", state.plan === "atins" ? "Privativo Rota Combo 09/08" : "Compartilhado Rota Combo 08/08", "Assim que o fim do trek fechar", "Malha semanal"],
            ["6", "Jeri + hotel FOR 12/08 + TTS + seguro", "Já", "Agosto = alta"],
          ]
        )}
      </section>`;
  }

  function sectionChecklist() {
    const items = [
      ["chkWalter", "Walter confirmou encontro (04 tarde OU 05 manhã em Atins) + comida inclusa por escrito"],
      ["chkLancha", "Lancha BRR→Atins 04/08 12:30 reservada (Satur/K-Beça) — paga por vocês"],
      ["chkVan", "Van Kairós SLZ→BRR 03/08 reservada"],
      ["chkHotelBrr", "Pousada Barreirinhas 03/08 ok"],
      ["chkHotelAtins", "Se Plano A: pousada Atins 04/08 ok"],
      ["chkTransferJeri", "Transfer Jeri reservado (compartilhado sáb OU privativo)"],
      ["chkHotelJeri", "Pousada Jeri ok"],
      ["chkFor", "Hotel Fortaleza 12/08 ok"],
      ["chkTts", "TTS canal oficial"],
      ["chkSeguro", "Seguro com trekking"],
      ["chkCash", "Plano de saque SLZ/BRR"],
    ];
    const checks = items
      .map(([id, label]) => {
        const on = !!state.tasks[id];
        return `<label class="check${on ? " is-on" : ""}"><input type="checkbox" data-task="${id}" ${on ? "checked" : ""} /><span>${label}</span></label>`;
      })
      .join("");
    return `
      <section class="section is-active">
        <h2>Checklist operacional</h2>
        <div class="block"><div class="check-list">${checks}</div></div>
        <h3>Notas (sem dados sensíveis)</h3>
        <div class="block">
          <textarea class="notes" id="notesField" placeholder="WhatsApp guia, confirmações… sem PNR/PIN/CPF"></textarea>
          <div style="display:flex;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap">
            <button type="button" class="btn btn--soft btn--sm" id="stampNotes">Carimbar data</button>
            <button type="button" class="btn btn--soft btn--sm" id="clearNotes">Limpar</button>
          </div>
        </div>
      </section>`;
  }

  function sectionDicas() {
    return `
      <section class="section is-active">
        <h2>Dicas práticas</h2>
        <div class="grid-2">
          <div class="block">
            <div class="block__title">Antes da trilha</div>
            <ul>
              <li>Espécie para oásis e entradas de Jeri</li>
              <li>Mochila 30–40 L; mala grande fora da trilha</li>
              <li>Headlamp, sandália de banho, UV, tampão de ouvido</li>
              <li>No Plano A: não destruam as pernas no dia 04 — dia seguinte é trilha</li>
            </ul>
          </div>
          <div class="block">
            <div class="block__title">ATM</div>
            <ul>
              <li>SLZ e Barreirinhas: saquem</li>
              <li>Atins / oásis / Jeri vila: ATM ruim ou inexistente</li>
              <li>Cash-back em Jeri é caro</li>
            </ul>
          </div>
        </div>
        <p class="muted">Fontes: Kairós, Satur/K-Beça, Vila das Águas, Maventur, Rota Combo, COOPBJ, Oba Jeri — reconfirmar na semana da viagem.</p>
      </section>`;
  }

  function renderContent(budget) {
    const map = {
      visao: () => sectionVisao(budget),
      planos: sectionPlanos,
      dias: sectionDias,
      travessia: sectionTravessia,
      jeri: sectionJeri,
      orcamento: () => sectionOrcamento(budget),
      fornecedores: sectionFornecedores,
      viabilidade: sectionViabilidade,
      prazos: sectionPrazos,
      checklist: sectionChecklist,
      dicas: sectionDicas,
    };
    els.conteudo.innerHTML = (map[state.tab] || map.visao)();
    bindSectionEvents();
  }

  function bindSectionEvents() {
    els.conteudo.querySelectorAll("[data-line]").forEach((input) => {
      input.addEventListener("change", () => {
        if (!state.lines) state.lines = {};
        state.lines[input.dataset.line] = input.checked;
        persist();
        render();
      });
    });
    els.conteudo.querySelectorAll("[data-task]").forEach((input) => {
      input.addEventListener("change", () => {
        state.tasks[input.dataset.task] = input.checked;
        persist();
        input.closest(".check")?.classList.toggle("is-on", input.checked);
      });
    });
    document.getElementById("resetLines")?.addEventListener("click", () => {
      state.lines = {};
      catalog().forEach((item) => {
        state.lines[item.id] = !!item.defaultOn;
      });
      persist();
      render();
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

  function persist() {
    saveState(state);
  }

  function syncControls() {
    els.scenario.value = state.scenario;
    els.plan.value = state.plan;
    els.jeriNights.value = state.jeriNights;
    els.trekMode.value = state.trekMode;
  }

  function renderFooter(budget) {
    els.footerStatus.textContent = `${money(budget.total)}/${money(CAP)} · ${PLANS[state.plan].short} · ${SCENARIO[state.scenario].label}`;
  }

  function applyPlanDefaults() {
    // When switching plan, refresh defaults for plan-specific + transfer exclusivity
    const items = catalog();
    if (!state.lines) state.lines = {};
    items.forEach((item) => {
      if (item.plans) state.lines[item.id] = !!item.defaultOn;
    });
    // Mutual exclusive transfers
    if (state.plan === "atins") {
      state.lines.transfer_jeri_shared = false;
      state.lines.transfer_jeri_private = true;
    } else {
      state.lines.transfer_jeri_shared = true;
      state.lines.transfer_jeri_private = false;
      state.lines.hotel_atins_04 = false;
      state.lines.food_atins_04 = false;
      state.lines.tour_canto = false;
    }
  }

  function render() {
    const budget = budgetFromLines();
    syncControls();
    renderStats(budget);
    renderUsage(budget);
    renderTabs();
    renderContent(budget);
    renderFooter(budget);
    persist();
  }

  ["scenario", "jeriNights", "trekMode"].forEach((key) => {
    els[key].addEventListener("change", () => {
      state[key] = els[key].value;
      render();
    });
  });

  els.plan.addEventListener("change", () => {
    state.plan = els.plan.value;
    applyPlanDefaults();
    render();
  });

  els.tabs.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tab]");
    if (!btn) return;
    state.tab = btn.dataset.tab;
    render();
    document.getElementById("conteudo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.resetBtn.addEventListener("click", () => {
    Object.assign(state, {
      scenario: "equilibrado",
      plan: "atins",
      jeriNights: "3",
      trekMode: "cotacao",
      tab: "visao",
      lines: null,
    });
    applyPlanDefaults();
    render();
    document.getElementById("painel")?.scrollIntoView({ behavior: "smooth" });
  });

  // Boot: se não há lines salvas, aplicar padrões do plano
  if (!saved?.lines) applyPlanDefaults();
  render();

  // ——— Loop de revisão automática (console) ———
  try {
    const b = budgetFromLines();
    const issues = [];
    if (!catalog().find((i) => i.id === "lancha")) issues.push("lancha missing");
    if (catalog().find((i) => i.id === "food_trek_zero")?.pp !== 0)
      issues.push("trek food not zero");
    if (state.plan === "atins" && lineOn("transfer_jeri_shared", catalog().find((i) => i.id === "transfer_jeri_shared") || { defaultOn: false }))
      issues.push("atins plan should prefer private transfer");
    if (SUPPLIERS.length < 8) issues.push("suppliers thin");
    if (issues.length) console.warn("[lencois review]", issues);
    else console.info("[lencois review] ok · total", b.total, "· plan", state.plan);
  } catch (e) {
    console.warn("[lencois review] fail", e);
  }
})();
