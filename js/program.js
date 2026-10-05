/*
  Retail English — program definition.

  This file is the single source of truth for the program design. The app reads
  everything from here: outcomes, the alignment matrix, units, assessment tasks,
  the role-play rubric, and the evaluation plan. Edit this file to match the final
  program document; no other file needs to change.

  Text fields come in pairs: en (English) and ar (Arabic).
  Dialogue speakers: "c" = customer, "k" = sales associate (the learner).

  Phrase tags used to build practice items:
    f    function group. Replies in the same group could both fit a customer line,
         so they are never offered as wrong answers for each other.
    gen  a generic reply ("One moment, please.") that fits too many lines to be
         a wrong answer anywhere.
    noR  the customer line is too vague, or the reply is a repair strategy, so the
         phrase is used for listening items but not for "choose the reply" items.

  In Arabic text, wrap English words in backticks (`like this`) so they display
  left to right inside the Arabic sentence.
*/
window.PROGRAM = {
  meta: {
    id: "retail-english",
    version: "2.4.0",
    title: { en: "Retail English" },
    subtitle: {
      en: "English for retail sales associates",
      ar: "اللغة الإنجليزية لموظفي المبيعات في قطاع التجزئة"
    },
    // Optional credits shown on the program page when filled in.
    designer: "",
    context: "",
    entryLevel: "CEFR A1–A2",
    exitLevel: "CEFR A2+ (job tasks)",
    weeks: 6,
    hours: 30,
    weeklyPattern: [
      { hours: 2, en: "Face-to-face workshop (teaching-learning cycle)", ar: "ورشة حضورية (دورة التعليم والتعلّم)" },
      { hours: 2, en: "App practice, about 20 minutes a day", ar: "تدريب على التطبيق، نحو 20 دقيقة يوميًا" },
      { hours: 1, en: "On-the-job mission with real customers", ar: "مهمة في مكان العمل مع عملاء حقيقيين" }
    ],
    mode: { en: "Blended", ar: "مدمج" },
    dailyMinutes: 20, // the daily app goal shown on Home
    passMark: 80, // unit checks, percent
    // Opens the trainer area (Settings › للمدربين), which holds the exit role-plays.
    // Give it to trainers only. It keeps learners from browsing the assessment pages,
    // but it is not a password: anyone who reads this file can see it.
    trainerCode: "7310"
  },

  // ---------------------------------------------------------------------------
  // Program learning outcomes. Each one names the task(s) that assess it,
  // so the alignment matrix shows both (see `assessments` below).
  // `can` is the learner-facing wording ("I can ..."), shown in the app.
  // ---------------------------------------------------------------------------
  outcomes: [
    {
      id: "PLO1",
      can: { ar: "أفتتح الحوار مع العميل وأختمه بلطف: أرحّب به، وأعرض المساعدة، وأشكره وأودّعه." },
      short: { en: "Open and close", ar: "الافتتاح والختام" },
      en: "Open and close service encounters politely: greet customers, offer help, thank them and say goodbye.",
      ar: "يفتتح حوار الخدمة ويختمه بلطف: يرحّب بالعميل ويعرض المساعدة ويشكره ويودّعه."
    },
    {
      id: "PLO2",
      can: { ar: "أفهم أسئلة العميل عن أماكن المنتجات، وأرشده إليها داخل المتجر." },
      short: { en: "Finding products", ar: "إرشاد العميل" },
      en: "Understand customers' questions about where products are, and give clear directions in the store.",
      ar: "يفهم أسئلة العملاء عن أماكن المنتجات ويعطي توجيهات واضحة داخل المتجر."
    },
    {
      id: "PLO3",
      can: { ar: "أصف المنتجات (المقاس واللون والخامة والسعر والعروض) وأقترح بدائل." },
      short: { en: "Describing products", ar: "وصف المنتجات" },
      en: "Describe products (size, colour, material, price, offers) and suggest alternatives.",
      ar: "يصف المنتجات (المقاس واللون والخامة والسعر والعروض) ويقترح بدائل."
    },
    {
      id: "PLO4",
      can: { ar: "أفهم الأسعار والمجموع والباقي وأقولها بدقة، وأرشد العميل في الدفع." },
      short: { en: "Prices and payment", ar: "الأسعار والدفع" },
      en: "Understand and say prices, totals and change accurately, and guide customers through payment.",
      ar: "يفهم الأسعار والمجموع والباقي ويقولها بدقة، ويرشد العميل خلال عملية الدفع."
    },
    {
      id: "PLO5",
      can: { ar: "أتعامل مع الإرجاع والاستبدال والشكاوى: أعتذر، وأشرح سياسة المتجر، وأحوّل إلى المشرف عند الحاجة." },
      short: { en: "Returns and complaints", ar: "الإرجاع والشكاوى" },
      en: "Handle returns, exchanges and complaints: apologise, explain store policy and refer to a supervisor when needed.",
      ar: "يتعامل مع الإرجاع والاستبدال والشكاوى: يعتذر ويشرح سياسة المتجر ويحوّل إلى المشرف عند الحاجة."
    },
    {
      id: "PLO6",
      can: { ar: "أحافظ على استمرار الحوار: أطلب الإعادة، وأتأكد من الفهم، وأؤكد الأرقام." },
      short: { en: "Keeping it going", ar: "استمرار الحوار" },
      en: "Keep the conversation going: ask for repetition, check understanding and confirm numbers.",
      ar: "يحافظ على استمرار الحوار: يطلب التكرار ويتحقق من الفهم ويؤكد الأرقام."
    }
  ],

  // ---------------------------------------------------------------------------
  // Assessment tasks. `summative: true` tasks decide whether an outcome is met.
  // Spoken outcomes are assessed by performance (role-plays), never by
  // multiple-choice items alone.
  // ---------------------------------------------------------------------------
  assessments: [
    {
      id: "DX",
      en: "Diagnostic role-play", ar: "لعب الأدوار التشخيصي",
      type: "performance", summative: false,
      when: { en: "Week 1", ar: "الأسبوع 1" },
      where: "trainer",
      plos: ["PLO1", "PLO2", "PLO4", "PLO6"],
      note: { en: "Baseline. Two raters, the same four criteria as the exit role-plays.", ar: "خط الأساس. مقيّمان، ونفس المعايير الأربعة للأدوار الختامية." }
    },
    {
      id: "LC",
      en: "Listening check (entry and exit forms)", ar: "اختبار الاستماع (نموذجا البداية والنهاية)",
      type: "objective", summative: true,
      when: { en: "Week 1 and Week 6", ar: "الأسبوع 1 والأسبوع 6" },
      where: "app",
      plos: ["PLO2", "PLO3", "PLO4", "PLO5"],
      note: { en: "Receptive part of the outcomes only: prices typed from audio, requests matched to meaning. Parallel forms, new sentences not taught in the units.", ar: "الجانب الاستقبالي فقط: كتابة الأسعار المسموعة وفهم الطلبات. نموذجان متكافئان بجمل جديدة لم تُدرّس." }
    },
    {
      id: "UC",
      en: "Unit checks", ar: "اختبارات الوحدات",
      type: "objective", summative: false,
      when: { en: "End of each unit", ar: "نهاية كل وحدة" },
      where: "app",
      plos: ["PLO1", "PLO2", "PLO3", "PLO4", "PLO5", "PLO6"],
      note: { en: "Formative. Feedback for the learner and the trainer; not used for certification.", ar: "تكويني. للتغذية الراجعة فقط ولا يُستخدم في الإجازة." }
    },
    {
      id: "MS",
      en: "On-the-job mission log", ar: "سجل مهام العمل",
      type: "portfolio", summative: false,
      when: { en: "Weekly", ar: "أسبوعيًا" },
      where: "app",
      plos: ["PLO1", "PLO2", "PLO3", "PLO4", "PLO5", "PLO6"],
      note: { en: "Formative evidence of transfer to the workplace; reviewed in each workshop.", ar: "دليل تكويني على نقل التعلم إلى العمل؛ يُراجع في كل ورشة." }
    },
    {
      id: "X1",
      en: "Exit role-play 1: Helping a customer choose", ar: "الدور الختامي 1: مساعدة عميل على الاختيار",
      type: "performance", summative: true,
      when: { en: "Week 6", ar: "الأسبوع 6" },
      where: "trainer",
      plos: ["PLO1", "PLO2", "PLO3", "PLO6"],
      note: { en: "Two raters, four criteria.", ar: "مقيّمان، أربعة معايير." }
    },
    {
      id: "X2",
      en: "Exit role-play 2: At the checkout", ar: "الدور الختامي 2: عند الكاشير",
      type: "performance", summative: true,
      when: { en: "Week 6", ar: "الأسبوع 6" },
      where: "trainer",
      plos: ["PLO1", "PLO4", "PLO6"],
      note: { en: "Two raters, four criteria.", ar: "مقيّمان، أربعة معايير." }
    },
    {
      id: "X3",
      en: "Exit role-play 3: A return that needs care", ar: "الدور الختامي 3: إرجاع يحتاج إلى عناية",
      type: "performance", summative: true,
      when: { en: "Week 6", ar: "الأسبوع 6" },
      where: "trainer",
      plos: ["PLO1", "PLO5", "PLO6"],
      note: { en: "Two raters, four criteria.", ar: "مقيّمان، أربعة معايير." }
    }
  ],

  // ---------------------------------------------------------------------------
  // Role-play rubric: the same four criteria for the diagnostic and exit
  // role-plays. Replace the labels and descriptors with the program's own.
  // ---------------------------------------------------------------------------
  rubric: {
    scale: [1, 2, 3, 4],
    scaleLabels: {
      1: { en: "Not yet", ar: "لم يتحقق بعد" },
      2: { en: "Partly", ar: "جزئيًا" },
      3: { en: "Meets the standard", ar: "يحقق المعيار" },
      4: { en: "Above the standard", ar: "يتجاوز المعيار" }
    },
    // An outcome is met when the mean of the two raters' totals reaches
    // `passTotal` and no criterion mean falls below `minCriterion`.
    passTotal: 12,
    minCriterion: 2,
    // Raters who differ by more than this on any criterion discuss or call a third rater.
    maxGap: 1,
    criteria: [
      {
        id: "C1",
        en: "Task completion", ar: "إنجاز المهمة",
        d: {
          1: { en: "Does not complete the task.", ar: "لا ينجز المهمة." },
          2: { en: "Completes part of the task, with help.", ar: "ينجز جزءًا من المهمة بمساعدة." },
          3: { en: "Completes the main task; small parts missing.", ar: "ينجز المهمة الأساسية مع نقص بسيط." },
          4: { en: "Completes every part; the customer's need is fully met.", ar: "ينجز كل الأجزاء وتُلبّى حاجة العميل كاملة." }
        }
      },
      {
        id: "C2",
        en: "Understanding and interaction", ar: "الفهم والتفاعل",
        d: {
          1: { en: "Rarely understands the customer; no repair.", ar: "نادرًا ما يفهم العميل، ولا يطلب التوضيح." },
          2: { en: "Often needs repetition; little clarification.", ar: "يحتاج إلى التكرار كثيرًا، وتوضيحه محدود." },
          3: { en: "Understands most turns; asks for clarification when needed.", ar: "يفهم معظم الكلام ويطلب التوضيح عند الحاجة." },
          4: { en: "Understands and responds promptly; checks and confirms details.", ar: "يفهم ويستجيب بسرعة ويتحقق من التفاصيل ويؤكدها." }
        }
      },
      {
        id: "C3",
        en: "Service language", ar: "لغة الخدمة",
        d: {
          1: { en: "Very limited language; meaning often unclear.", ar: "لغة محدودة جدًا والمعنى غير واضح غالبًا." },
          2: { en: "Errors sometimes block meaning or sound impolite.", ar: "أخطاء تعيق المعنى أو تبدو غير مهذبة أحيانًا." },
          3: { en: "Mostly accurate, polite phrases; small errors.", ar: "عبارات مهذبة ودقيقة غالبًا مع أخطاء بسيطة." },
          4: { en: "Accurate, polite phrases and the right words and numbers.", ar: "عبارات دقيقة ومهذبة وكلمات وأرقام صحيحة." }
        }
      },
      {
        id: "C4",
        en: "Clarity and fluency", ar: "الوضوح والطلاقة",
        d: {
          1: { en: "Hard to understand; long pauses.", ar: "صعب الفهم مع توقفات طويلة." },
          2: { en: "Hesitant; the listener needs effort.", ar: "متردد، ويحتاج المستمع إلى جهد." },
          3: { en: "Generally clear; some hesitation.", ar: "واضح عمومًا مع بعض التردد." },
          4: { en: "Clear and smooth.", ar: "واضح وسلس." }
        }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Role-play cards for trainers. Exit scenarios use products and problems that
  // the units do not practise, so the exit measure does not depend on the
  // exact sentences taught.
  // ---------------------------------------------------------------------------
  roleplayCards: [
    {
      id: "DX",
      setting: { en: "Supermarket. A customer needs one item and pays at the till.", ar: "سوبرماركت. يحتاج العميل منتجًا واحدًا ثم يدفع عند الكاشير." },
      learner: { en: "Greet the customer, help them find the item, tell them the price and total, take payment and close politely.", ar: "رحّب بالعميل، ساعده في إيجاد المنتج، أخبره بالسعر والمجموع، استلم الدفع واختم بلطف." },
      prompts: [
        "Hi. Excuse me, where's the honey?",
        "Sorry, which aisle?",
        "How much is this jar?",
        "OK. Can I pay by card?",
        "Thanks. Bye."
      ],
      look: [
        { plo: "PLO1", en: "Greets and offers help; closes politely", ar: "يرحّب ويعرض المساعدة ويختم بلطف" },
        { plo: "PLO2", en: "Gives a clear location", ar: "يحدد المكان بوضوح" },
        { plo: "PLO4", en: "Says the price and total correctly", ar: "يقول السعر والمجموع بشكل صحيح" },
        { plo: "PLO6", en: "Repeats or confirms when asked", ar: "يكرر أو يؤكد عند الطلب" }
      ]
    },
    {
      id: "X1",
      setting: { en: "Department store. A visitor wants a gift for under 150 riyals.", ar: "متجر متعدد الأقسام. زائر يريد هدية بأقل من 150 ريالًا." },
      learner: { en: "Greet, find out what the customer wants, show where it is, describe two options with prices, suggest a cheaper one, close politely.", ar: "رحّب، اعرف ما يريده العميل، أرشده إلى مكانه، صف خيارين مع السعر، اقترح خيارًا أرخص، واختم بلطف." },
      prompts: [
        "Hello. I'm looking for a gift for my mother.",
        "Maybe a scarf? Where are they?",
        "What colours do you have?",
        "How much is this one?",
        "Hmm, that's a bit expensive. Anything cheaper?",
        "Great, I'll take it. Thank you."
      ],
      look: [
        { plo: "PLO1", en: "Opens and closes politely", ar: "يفتتح ويختم بلطف" },
        { plo: "PLO2", en: "Understands the request and gives directions", ar: "يفهم الطلب ويعطي التوجيه" },
        { plo: "PLO3", en: "Describes colours and prices; offers an alternative", ar: "يصف الألوان والأسعار ويقترح بديلًا" },
        { plo: "PLO6", en: "Checks understanding at least once", ar: "يتحقق من الفهم مرة واحدة على الأقل" }
      ]
    },
    {
      id: "X2",
      setting: { en: "Pharmacy till. Three items; the card is declined once.", ar: "كاشير صيدلية. ثلاثة منتجات، وتُرفض البطاقة مرة واحدة." },
      learner: { en: "Greet, offer a bag, say the total (SAR 113.40), handle the declined card, accept a split payment, give the receipt, close.", ar: "رحّب، اعرض كيسًا، قل المجموع (113.40 ريال)، تعامل مع رفض البطاقة، اقبل الدفع المقسّم، أعطِ الإيصال، واختم." },
      prompts: [
        "Hi. No bag, thanks.",
        "Sorry, thirteen or thirty?",
        "It says declined.",
        "Can I pay one hundred in cash and the rest by card?",
        "Can I have the receipt, please?"
      ],
      look: [
        { plo: "PLO1", en: "Opens and closes politely", ar: "يفتتح ويختم بلطف" },
        { plo: "PLO4", en: "States the total and the card amount accurately (13.40)", ar: "يذكر المجموع ومبلغ البطاقة بدقة (13.40)" },
        { plo: "PLO4", en: "Guides the retry and the split payment", ar: "يرشد إلى إعادة المحاولة والدفع المقسّم" },
        { plo: "PLO6", en: "Confirms the confusable number", ar: "يؤكد الرقم المتشابه" }
      ]
    },
    {
      id: "X3",
      setting: { en: "Electronics shop. Headphones bought 10 days ago; the policy is 7 days. The customer has a bank SMS but no receipt.", ar: "متجر إلكترونيات. سماعات اشتُريت قبل 10 أيام، والسياسة 7 أيام. لدى العميل رسالة البنك وليس الإيصال." },
      learner: { en: "Ask for the receipt and the reason, explain the policy politely, offer an option (repair, exchange, supervisor), stay calm, close.", ar: "اطلب الإيصال والسبب، اشرح السياسة بلطف، اقترح خيارًا (إصلاح، استبدال، مشرف)، حافظ على هدوئك، واختم." },
      prompts: [
        "I want to return these headphones. The left side doesn't work.",
        "I don't have the receipt. I have the bank message.",
        "I bought them ten days ago.",
        "That's not fair. I want my money back.",
        "Fine. Call your supervisor, please."
      ],
      look: [
        { plo: "PLO5", en: "Asks for receipt and reason; explains the policy", ar: "يطلب الإيصال والسبب ويشرح السياسة" },
        { plo: "PLO5", en: "Apologises and offers a way forward or refers", ar: "يعتذر ويقترح حلًا أو يحوّل" },
        { plo: "PLO6", en: "Checks the dates and details", ar: "يتحقق من التواريخ والتفاصيل" },
        { plo: "PLO1", en: "Stays polite to the end", ar: "يبقى مهذبًا حتى النهاية" }
      ]
    }
  ],

  // ---------------------------------------------------------------------------
  // The syllabus. Units follow the stages of the service encounter, in the
  // order a sales associate meets them. Each unit runs one teaching-learning
  // cycle: building the field, modelling, joint construction, independent
  // construction, then a check and a mission at work.
  // ---------------------------------------------------------------------------
  units: [
    // ======================= UNIT 1 =======================
    {
      id: "u1", week: 1, icon: "wave",
      title: { en: "Welcome and offer help", ar: "الترحيب وعرض المساعدة" },
      plos: ["PLO1", "PLO6"],
      objectives: [
        { en: "Greet customers and offer help at any time of day.", ar: "أرحّب بالعميل وأعرض المساعدة في أي وقت من اليوم." },
        { en: "Ask a customer to repeat or slow down.", ar: "أطلب من العميل التكرار أو التحدث ببطء." },
        { en: "Thank customers and close the conversation politely.", ar: "أشكر العميل وأختم الحوار بلطف." }
      ],
      context: {
        ar: "كل حوار بيع يبدأ بالتحية وعرض المساعدة، وينتهي بالشكر والوداع. في هذه الوحدة تتعلم كيف تستقبل العميل بلطف، وماذا تقول إذا لم تفهم كلامه، وكيف تختم الحوار.",
        en: "Every sale starts with a greeting and an offer of help, and ends with thanks and goodbye."
      },
      words: [
        { en: "customer", ar: "عميل" },
        { en: "Welcome!", ar: "أهلًا بك!" },
        { en: "Can I help you?", ar: "هل أستطيع مساعدتك؟" },
        { en: "I'm just looking.", ar: "أتفرّج فقط." },
        { en: "again", ar: "مرة أخرى" },
        { en: "slower", ar: "أبطأ" },
        { en: "colleague", ar: "زميل" },
        { en: "Have a nice day!", ar: "يومك سعيد!" }
      ],
      stages: [
        { id: "greet", en: "Greeting", ar: "التحية" },
        { id: "offer", en: "Offer of help", ar: "عرض المساعدة" },
        { id: "request", en: "Request", ar: "الطلب" },
        { id: "repair", en: "Checking", ar: "التوضيح" },
        { id: "help", en: "Help", ar: "المساعدة" },
        { id: "close", en: "Closing", ar: "الختام" }
      ],
      model: {
        title: { en: "Looking for a charger", ar: "البحث عن شاحن" },
        setting: { en: "Electronics shop, morning", ar: "متجر إلكترونيات، صباحًا" },
        lines: [
          { s: "c", st: "greet", en: "Good morning.", ar: "صباح الخير." },
          { s: "k", st: "greet", en: "Good morning! Welcome.", ar: "صباح النور! أهلًا بك." },
          { s: "k", st: "offer", en: "Can I help you with anything?", ar: "هل أستطيع مساعدتك في شيء؟" },
          { s: "c", st: "request", en: "Yes, please. I'm looking for a phone charger.", ar: "نعم، من فضلك. أبحث عن شاحن جوال." },
          { s: "k", st: "repair", en: "Sorry, could you say that again, please?", ar: "عذرًا، هل يمكنك إعادة ذلك من فضلك؟" },
          { s: "c", st: "repair", en: "A phone charger.", ar: "شاحن جوال." },
          { s: "k", st: "help", en: "Ah, a charger. Let me show you. This way, please.", ar: "آه، شاحن. دعني أريك. من هنا من فضلك." },
          { s: "c", st: "close", en: "Thank you.", ar: "شكرًا لك." },
          { s: "k", st: "close", en: "You're welcome. Have a nice day!", ar: "العفو. يومك سعيد!" }
        ]
      },
      phrases: [
        { id: "u1-01", f: "open", c: ["Hello.", "Hi there."], cAr: "مرحبًا.", k: "Hello! Welcome.", kAr: "مرحبًا! أهلًا بك." },
        { id: "u1-02", f: "open", c: ["Good evening.", "Hi, good evening."], cAr: "مساء الخير.", k: "Good evening! How can I help you?", kAr: "مساء النور! كيف أستطيع مساعدتك؟" },
        { id: "u1-03", f: "open", c: ["Excuse me.", "Can you help me?"], cAr: "لو سمحت. / هل يمكنك مساعدتي؟", k: "Of course. How can I help?", kAr: "بالتأكيد. كيف أساعدك؟" },
        { id: "u1-04", f: "close", c: ["I'm just looking, thanks.", "I'm just browsing."], cAr: "أتفرّج فقط، شكرًا.", k: "No problem. Let me know if you need anything.", kAr: "لا مشكلة. أخبرني إذا احتجت أي شيء." },
        { id: "u1-05", f: "open", c: ["Do you speak English?", "Can we speak in English?"], cAr: "هل تتحدث الإنجليزية؟", k: "Yes, a little. How can I help?", kAr: "نعم، قليلًا. كيف أساعدك؟" },
        { id: "u1-06", f: "howareyou", c: ["How are you?", "How's your day going?"], cAr: "كيف حالك؟", k: "I'm fine, thank you. And you?", kAr: "بخير، شكرًا. وأنت؟" },
        { id: "u1-07", f: "repair", gen: true, noR: true, c: ["Is the one from the advert still available?", "Do you still have the one I saw online?"], cAr: "هل المنتج الذي في الإعلان ما زال متوفرًا؟", k: "Sorry, could you say that again, please?", kAr: "عذرًا، هل يمكنك إعادة ذلك من فضلك؟", tip: { ar: "إذا لم تفهم، اطلب الإعادة بلطف. هذا أفضل من التخمين.", en: "If you don't understand, ask. It is better than guessing." } },
        { id: "u1-08", f: "repair", gen: true, noR: true, c: ["I need a travel adapter for my laptop.", "Have you got travel adapters?"], cAr: "أحتاج محوّل سفر للابتوب.", k: "Sorry, a little slower, please.", kAr: "عذرًا، ببطء قليلًا من فضلك." },
        { id: "u1-09", f: "open", gen: true, c: ["Is there someone who speaks English?", "Can I talk to someone in English?"], cAr: "هل يوجد أحد يتحدث الإنجليزية؟", k: "One moment, please. I'll call my colleague.", kAr: "لحظة من فضلك. سأنادي زميلي." },
        { id: "u1-10", f: "open", gen: true, c: ["Can you check this for me?", "Can you help me with this?"], cAr: "هل يمكنك التحقق من هذا لي؟", k: "Sure. One moment, please.", kAr: "أكيد. لحظة من فضلك." },
        { id: "u1-11", f: "time", c: ["What time do you close?", "When do you close tonight?"], cAr: "متى تغلقون؟", k: "We close at eleven tonight.", kAr: "نغلق الساعة الحادية عشرة الليلة." },
        { id: "u1-12", f: "close", c: ["Thanks for your help.", "Thank you so much."], cAr: "شكرًا على مساعدتك.", k: "You're welcome. Have a nice day!", kAr: "العفو. يومك سعيد!" },
        { id: "u1-13", f: "close", c: ["Bye.", "See you."], cAr: "مع السلامة.", k: "Goodbye! See you again.", kAr: "مع السلامة! نراك مرة أخرى." }
      ],
      roleplay: {
        title: { en: "An evening customer", ar: "عميل في المساء" },
        setting: { en: "Clothing store, evening", ar: "متجر ملابس، مساءً" },
        lines: [
          { s: "c", en: "Good evening.", ar: "مساء الخير." },
          { s: "k", f: "open", en: "Good evening! Welcome. Can I help you?", ar: "مساء النور! أهلًا بك. هل أستطيع مساعدتك؟" },
          { s: "c", en: "I'm just looking, thanks.", ar: "أتفرّج فقط، شكرًا." },
          { s: "k", f: "close", en: "No problem. Let me know if you need anything.", ar: "لا مشكلة. أخبرني إذا احتجت أي شيء." },
          { s: "c", en: "Excuse me, do you speak English?", ar: "لو سمحت، هل تتحدث الإنجليزية؟" },
          { s: "k", f: "open", en: "Yes, a little. How can I help?", ar: "نعم، قليلًا. كيف أساعدك؟" },
          { s: "c", en: "Have you got this jacket in another colour?", ar: "هل لديكم هذا الجاكيت بلون آخر؟" },
          { s: "k", f: "repair", en: "Sorry, could you say that again, please?", ar: "عذرًا، هل يمكنك إعادة ذلك من فضلك؟" },
          { s: "c", en: "This jacket. Another colour?", ar: "هذا الجاكيت. لون آخر؟" },
          { s: "k", f: "open", en: "Sure. One moment, please.", ar: "أكيد. لحظة من فضلك." },
          { s: "c", en: "Thanks for your help.", ar: "شكرًا على مساعدتك." },
          { s: "k", f: "close", en: "You're welcome. Have a nice day!", ar: "العفو. يومك سعيد!" }
        ]
      },
      watchOut: {
        items: [
          { en: "You're welcome.", ar: "العفو: ردّك عندما يشكرك العميل" },
          { en: "Welcome!", ar: "أهلًا بك: عند استقبال العميل فقط" },
          { en: "Excuse me.", ar: "لجذب الانتباه بأدب" },
          { en: "Sorry?", ar: "للاعتذار، أو لطلب الإعادة" }
        ],
        en: "Answer “Thank you” with “You're welcome”. “Welcome” alone is for greeting."
      },
      mission: {
        short: "رحّب بثلاثة عملاء بالإنجليزية واعرض عليهم المساعدة.",
        ar: "رحّب بثلاثة عملاء على الأقل بالإنجليزية واعرض عليهم المساعدة. واستخدم الجملة أدناه مرة واحدة على الأقل، ثم سجّل ما حدث.",
        items: [{ en: "Sorry, could you say that again, please?", ar: "عذرًا، هل يمكنك إعادة ذلك من فضلك؟" }],
        en: "Greet at least three customers in English and offer help. Use “Sorry, could you say that again, please?” at least once. Note what happened."
      },
      workshop: {
        field: { ar: "نقاش: من عملاؤنا الذين يتحدثون الإنجليزية؟ ما المواقف التي مررتم بها؟ اجمع عبارات التحية الشائعة على السبورة.", en: "Discuss: who are our English-speaking customers, and what happened? Collect common greetings on the board." },
        joint: { ar: "يكتب الفصل مع المدرب حوارًا جديدًا في قسم آخر (مثل العطور) بالمراحل نفسها.", en: "Class and trainer co-write a new conversation for another department (for example, perfumes) with the same stages." },
        pairs: { ar: "بطاقات أدوار: عميل مستعجل، عميل يتفرّج فقط، عميل يتكلم بسرعة فيضطر الموظف إلى طلب الإعادة.", en: "Role cards: a customer in a hurry, one just browsing, one who speaks fast so the associate must ask for repetition." }
      }
    },

    // ======================= UNIT 2 =======================
    {
      id: "u2", week: 2, icon: "map",
      title: { en: "Finding products", ar: "إرشاد العميل إلى المنتجات" },
      plos: ["PLO2", "PLO6"],
      objectives: [
        { en: "Understand “Where is…?” questions about products.", ar: "أفهم أسئلة العميل عن أماكن المنتجات." },
        { en: "Give simple directions: aisle, shelf, next to, opposite, at the end of.", ar: "أعطي توجيهات بسيطة داخل المتجر." },
        { en: "Offer to show or check, and say when something is out of stock.", ar: "أعرض المرافقة أو التحقق، وأوضح عند نفاد المنتج." }
      ],
      context: {
        ar: "أكثر سؤال تسمعه: أين أجد…؟ في هذه الوحدة تتعلم أسماء أماكن المتجر وكلمات الاتجاه، وكيف ترافق العميل أو تتحقق له، وماذا تقول إذا لم يكن المنتج متوفرًا.",
        en: "The question you hear most is “Where can I find…?”"
      },
      words: [
        { en: "aisle", ar: "ممر" },
        { en: "shelf", ar: "رف" },
        { en: "next to", ar: "بجانب" },
        { en: "opposite", ar: "مقابل" },
        { en: "at the end of", ar: "في نهاية" },
        { en: "upstairs", ar: "في الطابق العلوي" },
        { en: "fitting room", ar: "غرفة القياس" },
        { en: "out of stock", ar: "غير متوفر حاليًا" }
      ],
      stages: [
        { id: "request", en: "Request", ar: "الطلب" },
        { id: "direct", en: "Directions", ar: "التوجيه" },
        { id: "repair", en: "Checking", ar: "التوضيح" },
        { id: "more", en: "Next request", ar: "طلب آخر" },
        { id: "close", en: "Closing", ar: "الختام" }
      ],
      model: {
        title: { en: "Rice and olive oil", ar: "الأرز وزيت الزيتون" },
        setting: { en: "Hypermarket", ar: "هايبر ماركت" },
        lines: [
          { s: "c", st: "request", en: "Excuse me, where can I find rice?", ar: "لو سمحت، أين أجد الأرز؟" },
          { s: "k", st: "direct", en: "Rice is in aisle seven, on the left.", ar: "الأرز في الممر السابع، على اليسار." },
          { s: "c", st: "repair", en: "Aisle seven?", ar: "الممر السابع؟" },
          { s: "k", st: "repair", en: "Yes, aisle seven. Next to the pasta.", ar: "نعم، الممر السابع. بجانب المعكرونة." },
          { s: "c", st: "more", en: "And where's the olive oil?", ar: "وأين زيت الزيتون؟" },
          { s: "k", st: "more", en: "It's in the same aisle, on the top shelf.", ar: "في الممر نفسه، على الرف العلوي." },
          { s: "c", st: "close", en: "Great, thanks.", ar: "ممتاز، شكرًا." },
          { s: "k", st: "close", en: "You're welcome. Let me know if you need anything else.", ar: "العفو. أخبرني إذا احتجت أي شيء آخر." }
        ]
      },
      phrases: [
        { id: "u2-01", f: "loc", gen: true, c: ["Where can I find rice?", "Where's the rice?"], cAr: "أين أجد الأرز؟", k: "It's in aisle seven.", kAr: "في الممر السابع." },
        { id: "u2-02", f: "loc", gen: true, c: ["Where are the baby products?", "Do you have a baby section?"], cAr: "أين منتجات الأطفال؟", k: "They're at the end of aisle three.", kAr: "في نهاية الممر الثالث." },
        { id: "u2-03", f: "fitting", c: ["Where's the fitting room?", "Where can I try this on?"], cAr: "أين غرفة القياس؟", k: "The fitting room is at the back, on the right.", kAr: "غرفة القياس في الخلف، على اليمين." },
        { id: "u2-04", f: "loc", gen: true, c: ["I can't find the milk.", "Where's the fresh milk?"], cAr: "لا أجد الحليب.", k: "Let me show you. Follow me, please.", kAr: "دعني أريك. اتبعني من فضلك." },
        { id: "u2-05", f: "loc", gen: true, c: ["Which floor is it on?", "Is it upstairs?"], cAr: "في أي طابق؟", k: "It's on the first floor. You can take the escalator.", kAr: "في الطابق الأول. يمكنك استخدام الدرج الكهربائي." },
        { id: "u2-06", f: "loc", gen: true, c: ["Is this in stock?", "Do you have this in stock?"], cAr: "هل هذا متوفر؟", k: "Let me check for you.", kAr: "دعني أتحقق لك." },
        { id: "u2-07", f: "loc", gen: true, c: ["Do you have any more of these?", "Are there more in the back?"], cAr: "هل لديكم المزيد من هذا؟", k: "I'll check the storeroom. One moment, please.", kAr: "سأتحقق من المستودع. لحظة من فضلك." },
        { id: "u2-08", f: "notsell", c: ["Do you sell phone chargers?", "Have you got chargers?"], cAr: "هل تبيعون شواحن جوال؟", k: "Sorry, we don't sell chargers.", kAr: "عذرًا، لا نبيع الشواحن." },
        { id: "u2-09", f: "loc", gen: true, c: ["Is it sold out?", "Are they all gone?"], cAr: "هل نفدت الكمية؟", k: "Sorry, it's out of stock. We'll have more on Sunday.", kAr: "عذرًا، غير متوفر حاليًا. يصلنا المزيد يوم الأحد." },
        { id: "u2-10", f: "checkout", c: ["Where's the checkout?", "Where do I pay?"], cAr: "أين الكاشير؟", k: "The checkout is near the entrance.", kAr: "الكاشير قرب المدخل." },
        { id: "u2-11", f: "restroom", c: ["Where are the restrooms?", "Is there a toilet here?"], cAr: "أين دورات المياه؟", k: "The restrooms are next to the prayer room.", kAr: "دورات المياه بجانب المصلى." },
        { id: "u2-12", f: "loc", gen: true, c: ["Is it far?", "Is it near here?"], cAr: "هل هو بعيد؟", k: "It's just over there, opposite the bakery.", kAr: "هناك تمامًا، مقابل المخبز." },
        { id: "u2-13", f: "loc", gen: true, c: ["Sorry, which aisle?", "Which aisle did you say?"], cAr: "عذرًا، أي ممر؟", k: "Aisle seven. Seven.", kAr: "الممر سبعة. سبعة.", tip: { ar: "إذا سأل العميل مرة أخرى، كرّر الرقم ببطء ووضوح.", en: "If the customer asks again, repeat the number slowly." } }
      ],
      roleplay: {
        title: { en: "Coffee and bread", ar: "القهوة والخبز" },
        setting: { en: "Supermarket", ar: "سوبرماركت" },
        lines: [
          { s: "c", en: "Excuse me. Where's the coffee?", ar: "لو سمحت. أين القهوة؟" },
          { s: "k", f: "loc", en: "It's in aisle four, next to the tea.", ar: "في الممر الرابع، بجانب الشاي." },
          { s: "c", en: "Sorry, which aisle?", ar: "عذرًا، أي ممر؟" },
          { s: "k", f: "loc", en: "Aisle four. Four.", ar: "الممر أربعة. أربعة." },
          { s: "c", en: "Do you have Turkish coffee?", ar: "هل لديكم قهوة تركية؟" },
          { s: "k", f: "loc", en: "Let me check for you.", ar: "دعني أتحقق لك." },
          { s: "c", en: "And where's the fresh bread?", ar: "وأين الخبز الطازج؟" },
          { s: "k", f: "loc", en: "The bakery is at the back of the store.", ar: "المخبز في آخر المتجر." },
          { s: "c", en: "Thanks a lot.", ar: "شكرًا جزيلًا." },
          { s: "k", f: "close", en: "You're welcome. Let me know if you need anything else.", ar: "العفو. أخبرني إذا احتجت أي شيء آخر." }
        ]
      },
      watchOut: {
        note: "في السعودية وبريطانيا الدور الأول فوق الدور الأرضي.",
        items: [
          { en: "aisle", ar: "ممر: تُنطق «آيل»، والسين لا تُنطق" },
          { en: "ground floor", ar: "الدور الأرضي" },
          { en: "first floor", ar: "الدور الأول، فوق الأرضي" }
        ],
        en: "“Aisle” sounds like “I'll”. Ground floor is the street level; first floor is the one above."
      },
      mission: {
        short: "ساعد ثلاثة عملاء على إيجاد منتجات بالإنجليزية.",
        ar: "ساعد ثلاثة عملاء على إيجاد منتجات بالإنجليزية، واستخدم العبارات أدناه. واكتب أسماء أقسام متجرك بالإنجليزية.",
        items: [
          { en: "It's in aisle seven.", ar: "في الممر السابع." },
          { en: "Let me show you.", ar: "دعني أريك." },
          { en: "Let me check.", ar: "دعني أتحقق." }
        ],
        en: "Help three customers find products in English. Use “It's in aisle…”, “Let me show you” or “Let me check”. List your store's sections in English."
      },
      workshop: {
        field: { ar: "ارسم خريطة مبسطة لمتجرك (الممرات والأقسام) واكتب أسماءها بالإنجليزية.", en: "Draw a simple map of your store and label the sections in English." },
        joint: { ar: "باستخدام الخريطة، يكتب الفصل حوارًا يرشد فيه الموظف عميلًا إلى منتجين في مكانين مختلفين.", en: "Using the map, co-write a conversation guiding a customer to two products in different places." },
        pairs: { ar: "يسأل العميل عن ثلاثة منتجات على الخريطة، أحدها غير متوفر.", en: "The customer asks for three items on the map; one is out of stock." }
      }
    },

    // ======================= UNIT 3 =======================
    {
      id: "u3", week: 3, icon: "tag",
      title: { en: "Products and prices", ar: "المنتجات والأسعار والعروض" },
      plos: ["PLO3", "PLO4"],
      objectives: [
        { en: "Answer questions about size, colour and material.", ar: "أجيب عن أسئلة المقاس واللون والخامة." },
        { en: "Say prices and explain offers and discounts.", ar: "أقول الأسعار وأشرح العروض والخصومات." },
        { en: "Suggest an alternative product.", ar: "أقترح منتجًا بديلًا." }
      ],
      context: {
        ar: "يسأل العميل عن المقاس واللون والسعر والعروض. في هذه الوحدة تتعلم وصف المنتج، وقول السعر بالإنجليزية، وشرح العروض، واقتراح بديل أرخص أو أنسب.",
        en: "Customers ask about size, colour, price and offers."
      },
      words: [
        { en: "size", ar: "مقاس" },
        { en: "small / medium / large", ar: "صغير / متوسط / كبير" },
        { en: "colour", ar: "لون" },
        { en: "cheaper", ar: "أرخص" },
        { en: "on sale", ar: "عليه تخفيض" },
        { en: "percent off", ar: "خصم بالمئة" },
        { en: "try on", ar: "يقيس / يجرّب" },
        { en: "warranty", ar: "ضمان" }
      ],
      stages: [
        { id: "enquiry", en: "Product question", ar: "سؤال عن المنتج" },
        { id: "info", en: "Information", ar: "المعلومة" },
        { id: "price", en: "Price", ar: "السعر" },
        { id: "next", en: "Next step", ar: "الخطوة التالية" }
      ],
      model: {
        title: { en: "A shirt in medium", ar: "قميص بمقاس متوسط" },
        setting: { en: "Clothing store", ar: "متجر ملابس" },
        lines: [
          { s: "c", st: "enquiry", en: "Excuse me, do you have this shirt in a medium?", ar: "لو سمحت، هل لديكم هذا القميص بمقاس متوسط؟" },
          { s: "k", st: "info", en: "Yes, here's a medium.", ar: "نعم، تفضل مقاس متوسط." },
          { s: "c", st: "enquiry", en: "Do you have it in blue?", ar: "هل يتوفر باللون الأزرق؟" },
          { s: "k", st: "info", en: "Sorry, we only have it in white and black.", ar: "عذرًا، متوفر بالأبيض والأسود فقط." },
          { s: "c", st: "price", en: "How much is it?", ar: "بكم هو؟" },
          { s: "k", st: "price", en: "It's eighty-nine riyals. Today there's twenty percent off.", ar: "بتسعة وثمانين ريالًا. واليوم عليه خصم عشرين بالمئة." },
          { s: "c", st: "next", en: "Can I try it on?", ar: "هل أستطيع قياسه؟" },
          { s: "k", st: "next", en: "Of course. The fitting room is over there.", ar: "بالتأكيد. غرفة القياس هناك." }
        ]
      },
      phrases: [
        { id: "u3-01", f: "size", c: ["Do you have this in a medium?", "Is there a bigger size?"], cAr: "هل لديكم هذا بمقاس متوسط؟", k: "Let me check. What size do you need?", kAr: "دعني أتحقق. ما المقاس الذي تحتاجه؟" },
        { id: "u3-02", f: "colour", c: ["What colours do you have?", "Do you have it in black?"], cAr: "ما الألوان المتوفرة؟", k: "It comes in black, white and grey.", kAr: "متوفر بالأسود والأبيض والرمادي." },
        { id: "u3-03", f: "pick", c: ["How much is this?", "What's the price?"], cAr: "بكم هذا؟", k: "It's forty-nine riyals.", kAr: "بتسعة وأربعين ريالًا." },
        { id: "u3-04", f: "discount", c: ["Is this on sale?", "Is there a discount on this?"], cAr: "هل عليه تخفيض؟", k: "Yes, it's thirty percent off today.", kAr: "نعم، عليه خصم ثلاثين بالمئة اليوم." },
        { id: "u3-05", f: "pick", c: ["Do you have anything cheaper?", "It's too expensive."], cAr: "هل لديكم شيء أرخص؟", k: "This one is cheaper. It's twenty-five riyals.", kAr: "هذا أرخص. سعره خمسة وعشرون ريالًا." },
        { id: "u3-06", f: "pick", c: ["What do you recommend?", "Which one is better?"], cAr: "بماذا تنصح؟", k: "This one is very popular. Many customers like it.", kAr: "هذا مطلوب جدًا. يحبه كثير من العملاء." },
        { id: "u3-07", f: "tryon", c: ["Can I try it on?", "Where can I try this?"], cAr: "هل أستطيع قياسه؟", k: "Of course. The fitting room is over there.", kAr: "بالتأكيد. غرفة القياس هناك." },
        { id: "u3-08", f: "size", c: ["It's too small.", "Do you have a larger one?"], cAr: "إنه صغير جدًا.", k: "Here's a large. Would you like to try it?", kAr: "تفضل مقاس كبير. هل تود تجربته؟" },
        { id: "u3-09", f: "material", c: ["What's it made of?", "Is it cotton?"], cAr: "من أي خامة هو؟", k: "It's one hundred percent cotton.", kAr: "قطن مئة بالمئة." },
        { id: "u3-10", f: "warranty", c: ["Does it have a warranty?", "Is there a guarantee?"], cAr: "هل عليه ضمان؟", k: "Yes, it has a one-year warranty.", kAr: "نعم، عليه ضمان لمدة سنة." },
        { id: "u3-11", f: "discount", c: ["What's the offer?", "Is it buy one, get one free?"], cAr: "ما العرض؟", k: "Yes. Buy one, get one free.", kAr: "نعم. اشترِ واحدًا واحصل على الثاني مجانًا." },
        { id: "u3-12", f: "vat", c: ["Does the price include VAT?", "Is that with tax?"], cAr: "هل السعر شامل الضريبة؟", k: "Yes, all our prices include VAT.", kAr: "نعم، جميع أسعارنا شاملة ضريبة القيمة المضافة." },
        { id: "u3-13", f: "pricecheck", gen: true, c: ["It says forty on the shelf.", "The shelf price is different."], cAr: "السعر على الرف أربعون.", k: "Let me check it on the system.", kAr: "دعني أتحقق منه في النظام." }
      ],
      roleplay: {
        title: { en: "Shoes in size 42", ar: "حذاء مقاس 42" },
        setting: { en: "Shoe shop", ar: "متجر أحذية" },
        lines: [
          { s: "c", en: "Hi. Do you have these shoes in size forty-two?", ar: "مرحبًا. هل لديكم هذا الحذاء بمقاس 42؟" },
          { s: "k", f: "size", en: "Yes, we do. Here you are.", ar: "نعم، لدينا. تفضل." },
          { s: "c", en: "What colours do you have?", ar: "ما الألوان المتوفرة؟" },
          { s: "k", f: "colour", en: "They come in black and brown.", ar: "متوفرة بالأسود والبني." },
          { s: "c", en: "How much are they?", ar: "بكم هي؟" },
          { s: "k", f: "pick", en: "They're one hundred and fifty riyals.", ar: "بمئة وخمسين ريالًا." },
          { s: "c", en: "Hmm. Do you have anything cheaper?", ar: "همم. هل لديكم شيء أرخص؟" },
          { s: "k", f: "pick", en: "These are cheaper. They're ninety-nine riyals.", ar: "هذه أرخص. سعرها تسعة وتسعون ريالًا." },
          { s: "c", en: "Great. Can I try them on?", ar: "ممتاز. هل أستطيع تجربتها؟" },
          { s: "k", f: "tryon", en: "Of course. Please have a seat.", ar: "بالتأكيد. تفضل بالجلوس." }
        ]
      },
      watchOut: {
        items: [
          { en: "on sale", ar: "عليه تخفيض" },
          { en: "for sale", ar: "معروض للبيع" },
          { en: "Buy one, get one free.", ar: "اشترِ قطعة وخذ الثانية مجانًا، وليس خصمًا على الأولى" }
        ],
        en: "“On sale” means discounted; “for sale” means available to buy."
      },
      mission: {
        short: "صِف ثلاثة منتجات من قسمك بالإنجليزية، ثم صِف واحدًا لعميل.",
        ar: "اختر ثلاثة منتجات من قسمك وتدرّب على وصفها بالإنجليزية (المقاس أو اللون والسعر والعرض إن وجد). ثم استخدم وصفًا واحدًا على الأقل مع عميل حقيقي.",
        en: "Choose three products in your section and practise describing them (size or colour, price, any offer). Use one description with a real customer."
      },
      workshop: {
        field: { ar: "أحضر منتجات حقيقية أو صورًا (ملابس، أحذية، أجهزة). صِف المقاس واللون والخامة والسعر.", en: "Bring real products or photos (clothes, shoes, devices). Describe size, colour, material and price." },
        joint: { ar: "يكتب الفصل حوارًا يقترح فيه الموظف بديلًا أرخص.", en: "Co-write a conversation where the associate suggests a cheaper alternative." },
        pairs: { ar: "عميل يبحث عن هدية بميزانية محددة (مثلًا 100 ريال).", en: "A customer wants a gift on a budget (for example, SAR 100)." }
      }
    },

    // ======================= UNIT 4 =======================
    {
      id: "u4", week: 4, icon: "card",
      title: { en: "Checkout and payment", ar: "المحاسبة والدفع" },
      plos: ["PLO4", "PLO1", "PLO6"],
      objectives: [
        { en: "Say totals and change clearly, with halalas.", ar: "أقول المجموع والباقي بوضوح، مع الهللات." },
        { en: "Guide card, phone and cash payments, and handle a declined card.", ar: "أرشد العميل في الدفع بالبطاقة أو الجوال أو نقدًا، وأتعامل مع رفض البطاقة." },
        { en: "Confirm numbers that sound alike (13/30, 15/50).", ar: "أتحقق من الأرقام المتشابهة في النطق (13/30، 15/50)." }
      ],
      context: {
        ar: "عند الكاشير: الأكياس، المجموع، طريقة الدفع، الباقي، الإيصال. الأرقام أهم شيء هنا، فانتبه للأرقام المتشابهة مثل 13 و30، و15 و50.",
        en: "At the till, numbers matter most."
      },
      words: [
        { en: "total", ar: "المجموع" },
        { en: "bag", ar: "كيس" },
        { en: "cash", ar: "نقدًا" },
        { en: "tap your card", ar: "قرّب بطاقتك" },
        { en: "PIN", ar: "الرقم السري" },
        { en: "declined", ar: "مرفوضة" },
        { en: "change", ar: "الباقي" },
        { en: "receipt", ar: "الإيصال" }
      ],
      stages: [
        { id: "greet", en: "Greeting", ar: "التحية" },
        { id: "items", en: "Bags and items", ar: "الأكياس والمنتجات" },
        { id: "total", en: "Total", ar: "المجموع" },
        { id: "repair", en: "Checking", ar: "التوضيح" },
        { id: "pay", en: "Payment", ar: "الدفع" },
        { id: "close", en: "Closing", ar: "الختام" }
      ],
      model: {
        title: { en: "Ninety-four or nineteen?", ar: "أربعة وتسعون أم تسعة عشر؟" },
        setting: { en: "Supermarket till", ar: "كاشير سوبرماركت" },
        lines: [
          { s: "k", st: "greet", en: "Hello! Do you need a bag?", ar: "مرحبًا! هل تحتاج كيسًا؟" },
          { s: "c", st: "items", en: "Yes, two bags, please.", ar: "نعم، كيسين من فضلك." },
          { s: "k", st: "total", en: "Sure. Your total is ninety-four riyals and fifty halalas.", ar: "أكيد. المجموع أربعة وتسعون ريالًا وخمسون هللة." },
          { s: "c", st: "repair", en: "Sorry, ninety or nineteen?", ar: "عذرًا، تسعون أم تسعة عشر؟" },
          { s: "k", st: "repair", en: "Ninety-four. Nine, four.", ar: "أربعة وتسعون. تسعة، أربعة." },
          { s: "c", st: "pay", en: "OK. Can I pay by card?", ar: "حسنًا. هل أستطيع الدفع بالبطاقة؟" },
          { s: "k", st: "pay", en: "Yes, please tap your card here.", ar: "نعم، قرّب بطاقتك هنا من فضلك." },
          { s: "c", st: "pay", en: "Done.", ar: "تم." },
          { s: "k", st: "close", en: "Thank you. Here's your receipt. Have a nice day!", ar: "شكرًا. تفضل الإيصال. يومك سعيد!" }
        ]
      },
      phrases: [
        { id: "u4-01", f: "total", c: ["What's the total?", "How much is it all together?"], cAr: "كم المجموع؟", k: "Your total is sixty-five riyals.", kAr: "المجموع خمسة وستون ريالًا." },
        { id: "u4-02", f: "confirm", c: ["Did you say fifteen or fifty?", "Fifteen?"], cAr: "هل قلت خمسة عشر أم خمسين؟", k: "Fifty. Five, zero.", kAr: "خمسون. خمسة، صفر." },
        { id: "u4-03", f: "bag", c: ["Can I have a bag?", "Do you have bags?"], cAr: "هل أستطيع أخذ كيس؟", k: "Sure. One bag or two?", kAr: "أكيد. كيس أم كيسان؟" },
        { id: "u4-04", f: "card", c: ["Can I pay by card?", "Do you take Mada?"], cAr: "هل أستطيع الدفع بالبطاقة؟", k: "Yes. Please tap your card here.", kAr: "نعم. قرّب بطاقتك هنا من فضلك." },
        { id: "u4-05", f: "card", c: ["Can I pay with my phone?", "Can I use Apple Pay?"], cAr: "هل أستطيع الدفع بالجوال؟", k: "Yes, just hold your phone near the machine.", kAr: "نعم، فقط قرّب جوالك من الجهاز." },
        { id: "u4-06", f: "card", c: ["It says declined.", "It's not working."], cAr: "مكتوب: مرفوضة.", k: "It didn't go through. Please try again.", kAr: "لم تتم العملية. حاول مرة أخرى من فضلك." },
        { id: "u4-07", f: "card", c: ["Do I need to enter my PIN?", "PIN?"], cAr: "هل أدخل الرقم السري؟", k: "Yes, please enter your PIN.", kAr: "نعم، أدخل الرقم السري من فضلك." },
        { id: "u4-08", f: "change", c: ["Here's two hundred.", "Here you are, two hundred riyals."], cAr: "تفضل مئتين.", k: "Thank you. Your change is thirty-four riyals.", kAr: "شكرًا. الباقي أربعة وثلاثون ريالًا." },
        { id: "u4-09", f: "split", c: ["Can I pay part cash, part card?", "Can I split the payment?"], cAr: "هل أستطيع تقسيم الدفع؟", k: "Yes. How much would you like to pay in cash?", kAr: "نعم. كم تريد أن تدفع نقدًا؟" },
        { id: "u4-10", f: "loyalty", c: ["Can I use my points?", "I have a loyalty card."], cAr: "هل أستطيع استخدام نقاطي؟", k: "Sure. Please scan your loyalty card here.", kAr: "أكيد. امسح بطاقة الولاء هنا من فضلك." },
        { id: "u4-11", f: "notes", c: ["Can I have smaller notes?", "Do you have small change?"], cAr: "هل يمكن أن تعطيني فئات أصغر؟", k: "Sorry, I don't have small notes right now.", kAr: "عذرًا، ليس لدي فئات صغيرة الآن." },
        { id: "u4-12", f: "fix", gen: true, c: ["You scanned this twice.", "I only have one of these."], cAr: "مسحت هذا مرتين.", k: "Sorry about that. I'll fix it now.", kAr: "آسف على ذلك. سأصلحه الآن." },
        { id: "u4-13", f: "fix", c: ["I don't want this one.", "Can you take this off?"], cAr: "لا أريد هذا.", k: "No problem. I'll remove it.", kAr: "لا مشكلة. سأحذفه." },
        { id: "u4-14", f: "receipt", c: ["Receipt, please.", "Can I have the receipt?"], cAr: "الإيصال من فضلك.", k: "Here's your receipt. Have a nice day!", kAr: "تفضل الإيصال. يومك سعيد!" }
      ],
      roleplay: {
        title: { en: "Cash and change", ar: "الدفع النقدي والباقي" },
        setting: { en: "Supermarket till", ar: "كاشير سوبرماركت" },
        lines: [
          { s: "k", f: "bag", en: "Hello! Do you need a bag?", ar: "مرحبًا! هل تحتاج كيسًا؟" },
          { s: "c", en: "Yes, one bag, please.", ar: "نعم، كيس واحد من فضلك." },
          { s: "k", f: "total", en: "Sure. Your total is fifty-seven riyals and twenty-five halalas.", ar: "أكيد. المجموع سبعة وخمسون ريالًا وخمس وعشرون هللة." },
          { s: "c", en: "Sorry, how much?", ar: "عذرًا، كم؟" },
          { s: "k", f: "total", en: "Fifty-seven riyals and twenty-five halalas.", ar: "سبعة وخمسون ريالًا وخمس وعشرون هللة." },
          { s: "c", en: "Here's one hundred.", ar: "تفضل مئة." },
          { s: "k", f: "change", en: "Thank you. Your change is forty-two riyals and seventy-five halalas.", ar: "شكرًا. الباقي اثنان وأربعون ريالًا وخمس وسبعون هللة." },
          { s: "c", en: "Thanks.", ar: "شكرًا." },
          { s: "k", f: "receipt", en: "Here's your receipt. Have a nice day!", ar: "تفضل الإيصال. يومك سعيد!" }
        ]
      },
      watchOut: {
        note: "الأرقام 13 إلى 19 يكون الضغط في آخرها، والعشرات 30 إلى 90 في أولها.",
        items: [
          { en: "Here's your change.", ar: "تفضل الباقي" },
          { en: "thir-TEEN", say: "thirteen", ar: "13: الضغط في آخر الكلمة" },
          { en: "THIR-ty", say: "thirty", ar: "30: الضغط في أول الكلمة" },
          { en: "Thirteen or thirty?", ar: "اسأل هكذا إذا شككت" }
        ],
        en: "Teen numbers stress the end (thir-TEEN); tens stress the start (THIR-ty)."
      },
      mission: {
        short: "قل المجموع بالإنجليزية لخمسة عملاء على الأقل.",
        ar: "قل المجموع بالإنجليزية لخمسة عملاء على الأقل، واطلب التأكيد إذا لم تسمع رقمًا جيدًا. سجّل رقمًا واحدًا كان صعبًا.",
        en: "Say the total in English to at least five customers, and confirm any number you did not hear well. Note one number that was hard."
      },
      workshop: {
        field: { ar: "لعبة الأرقام: يقول المدرب أسعارًا ويكتبها المتدربون (ركّز على 13/30 و15/50 والهللات).", en: "Numbers game: the trainer says prices and learners write them (focus on 13/30, 15/50 and halalas)." },
        joint: { ar: "يكتب الفصل حوار دفع ببطاقة مرفوضة ثم دفع مقسّم.", en: "Co-write a checkout with a declined card, then a split payment." },
        pairs: { ar: "بطاقات: مجاميع مختلفة، دفع نقدي مع باقٍ، دفع بالجوال، نقاط الولاء.", en: "Cards with different totals, cash with change, phone payment, loyalty points." }
      }
    },

    // ======================= UNIT 5 =======================
    {
      id: "u5", week: 5, icon: "swap",
      title: { en: "Returns and exchanges", ar: "الإرجاع والاستبدال" },
      plos: ["PLO5", "PLO6"],
      objectives: [
        { en: "Ask for the receipt and the reason for a return.", ar: "أطلب الإيصال وأسأل عن سبب الإرجاع." },
        { en: "Explain the difference between a refund and an exchange.", ar: "أوضح الفرق بين الاسترداد والاستبدال." },
        { en: "Explain store policy politely.", ar: "أشرح سياسة المتجر بلطف." }
      ],
      context: {
        ar: "يريد العميل إرجاع منتج أو استبداله. تتعلم هنا الفرق بين `refund` و`exchange`، وكيف تسأل عن الإيصال والسبب، وكيف تشرح سياسة المتجر بلطف حتى عندما يكون الجواب «لا».",
        en: "A customer wants to return or exchange something."
      },
      words: [
        { en: "return", ar: "إرجاع" },
        { en: "refund", ar: "استرداد المبلغ" },
        { en: "exchange", ar: "استبدال" },
        { en: "receipt", ar: "إيصال" },
        { en: "faulty", ar: "معيب" },
        { en: "policy", ar: "سياسة" },
        { en: "within seven days", ar: "خلال سبعة أيام" },
        { en: "unused", ar: "غير مستخدم" }
      ],
      stages: [
        { id: "request", en: "Request", ar: "الطلب" },
        { id: "ask", en: "Questions", ar: "الأسئلة" },
        { id: "options", en: "Options", ar: "الخيارات" },
        { id: "action", en: "Action", ar: "الإجراء" }
      ],
      model: {
        title: { en: "The wrong size", ar: "المقاس غير المناسب" },
        setting: { en: "Clothing store", ar: "متجر ملابس" },
        lines: [
          { s: "c", st: "request", en: "Hi. I'd like to return this, please.", ar: "مرحبًا. أريد إرجاع هذا من فضلك." },
          { s: "k", st: "ask", en: "Sure. Do you have the receipt?", ar: "أكيد. هل معك الإيصال؟" },
          { s: "c", st: "ask", en: "Yes, here it is.", ar: "نعم، تفضل." },
          { s: "k", st: "ask", en: "Thank you. What's wrong with it?", ar: "شكرًا. ما المشكلة فيه؟" },
          { s: "c", st: "ask", en: "It's the wrong size.", ar: "المقاس غير مناسب." },
          { s: "k", st: "options", en: "Would you like to exchange it or get a refund?", ar: "هل تريد استبداله أم استرداد المبلغ؟" },
          { s: "c", st: "options", en: "An exchange, please.", ar: "استبدال من فضلك." },
          { s: "k", st: "action", en: "No problem. You can choose a new size.", ar: "لا مشكلة. يمكنك اختيار مقاس آخر." }
        ]
      },
      phrases: [
        { id: "u5-01", f: "return", c: ["I'd like to return this.", "Can I return this?"], cAr: "أريد إرجاع هذا.", k: "Sure. Do you have the receipt?", kAr: "أكيد. هل معك الإيصال؟" },
        { id: "u5-02", f: "noreceipt", c: ["I lost the receipt.", "I don't have the receipt."], cAr: "أضعت الإيصال.", k: "Sorry, we need the receipt for returns.", kAr: "عذرًا، نحتاج الإيصال للإرجاع." },
        { id: "u5-03", f: "size", c: ["It doesn't fit.", "It's the wrong size."], cAr: "المقاس غير مناسب.", k: "Would you like a different size?", kAr: "هل تريد مقاسًا آخر؟" },
        { id: "u5-04", f: "faulty", gen: true, c: ["It doesn't work.", "It's broken."], cAr: "إنه لا يعمل.", k: "I'm sorry about that. Let me check it.", kAr: "آسف لذلك. دعني أفحصه." },
        { id: "u5-05", f: "refund", c: ["I want a refund.", "Can I get my money back?"], cAr: "أريد استرداد المبلغ.", k: "Yes. The refund will go back to your card.", kAr: "نعم. سيُعاد المبلغ إلى بطاقتك." },
        { id: "u5-06", f: "size", c: ["Can I exchange it?", "Can I change it for another one?"], cAr: "هل أستطيع استبداله؟", k: "Yes, you can exchange it within seven days.", kAr: "نعم، يمكنك استبداله خلال سبعة أيام." },
        { id: "u5-07", f: "late", c: ["I bought it two weeks ago.", "I bought it fifteen days ago."], cAr: "اشتريته قبل أسبوعين.", k: "Sorry, returns are only within seven days.", kAr: "عذرًا، الإرجاع خلال سبعة أيام فقط." },
        { id: "u5-08", f: "used", c: ["I opened the box.", "I used it once."], cAr: "فتحت العلبة.", k: "Sorry, it must be unused and in the original box.", kAr: "عذرًا، يجب أن يكون غير مستخدم وفي علبته الأصلية." },
        { id: "u5-09", f: "time", c: ["When will I get my money?", "How long does the refund take?"], cAr: "متى يصلني المبلغ؟", k: "It usually takes three to five working days.", kAr: "يستغرق عادة من ثلاثة إلى خمسة أيام عمل." },
        { id: "u5-10", f: "refund", c: ["Can I have cash instead?", "Can you give me cash?"], cAr: "هل يمكن أن آخذ المبلغ نقدًا؟", k: "Sorry, card payments are refunded to the card.", kAr: "عذرًا، المدفوعات بالبطاقة تُسترد إلى البطاقة." },
        { id: "u5-11", f: "credit", c: ["Can I use it later?", "Can I get store credit?"], cAr: "هل أستطيع استخدامه لاحقًا؟", k: "Yes, we can give you a store credit voucher.", kAr: "نعم، يمكننا إعطاؤك قسيمة رصيد للمتجر." },
        { id: "u5-12", f: "return", c: ["Where do I return this?", "Do I return it here?"], cAr: "أين أرجع هذا؟", k: "Returns are at customer service, near the entrance.", kAr: "الإرجاع من خدمة العملاء، قرب المدخل." },
        { id: "u5-13", f: "policy", gen: true, c: ["That's not fair.", "Why not?"], cAr: "هذا ليس عدلًا.", k: "I understand. That's the store policy, but I can call my supervisor.", kAr: "أتفهم ذلك. هذه سياسة المتجر، لكن يمكنني استدعاء المشرف." }
      ],
      roleplay: {
        title: { en: "A jacket that's too big", ar: "جاكيت كبير المقاس" },
        setting: { en: "Clothing store", ar: "متجر ملابس" },
        lines: [
          { s: "c", en: "Hello. I want to exchange this jacket.", ar: "مرحبًا. أريد استبدال هذا الجاكيت." },
          { s: "k", f: "return", en: "Sure. Do you have the receipt?", ar: "أكيد. هل معك الإيصال؟" },
          { s: "c", en: "Yes, here.", ar: "نعم، تفضل." },
          { s: "k", f: "ask", en: "Thank you. What's the problem with it?", ar: "شكرًا. ما المشكلة فيه؟" },
          { s: "c", en: "It's too big.", ar: "إنه كبير جدًا." },
          { s: "k", f: "size", en: "Would you like a smaller size?", ar: "هل تريد مقاسًا أصغر؟" },
          { s: "c", en: "Yes, a medium, please.", ar: "نعم، مقاس متوسط من فضلك." },
          { s: "k", f: "size", en: "No problem. Let me get a medium for you.", ar: "لا مشكلة. دعني أحضر لك مقاسًا متوسطًا." }
        ]
      },
      watchOut: {
        items: [
          { en: "refund", ar: "استرداد المبلغ" },
          { en: "exchange", ar: "استبدال المنتج بآخر" },
          { en: "cash back", ar: "سحب نقدي عند الدفع بالبطاقة، وليس استرجاع المال" }
        ],
        en: "Refund = money back. Exchange = a different item. “Cash back” is not a refund."
      },
      mission: {
        short: "اكتب سياسة الإرجاع في متجرك في ثلاث جمل إنجليزية.",
        ar: "اعرف سياسة الإرجاع والاستبدال في متجرك، واكتبها في ثلاث جمل إنجليزية بسيطة مثل الجملة أدناه. ثم تدرّب على قولها بصوت عالٍ.",
        items: [{ en: "Returns within 7 days with the receipt.", ar: "الإرجاع خلال 7 أيام مع الإيصال." }],
        en: "Find your store's return and exchange policy and write it in three simple English sentences (for example, “Returns within 7 days with the receipt.”). Practise saying them."
      },
      workshop: {
        field: { ar: "اقرأ سياسة الإرجاع في متجرك وحوّلها إلى ثلاث جمل إنجليزية بسيطة.", en: "Turn your store's return policy into three simple English sentences." },
        joint: { ar: "يكتب الفصل حوار استبدال ناجحًا، ثم حوار إرجاع مرفوضًا لانتهاء المدة.", en: "Co-write a successful exchange, then a return refused because it is too late." },
        pairs: { ar: "بطاقات: بلا إيصال، منتج مستخدم، مقاس خاطئ، منتج معيب.", en: "Cards: no receipt, a used item, the wrong size, a faulty item." }
      }
    },

    // ======================= UNIT 6 =======================
    {
      id: "u6", week: 6, icon: "chat",
      title: { en: "Problems and complaints", ar: "المشكلات والشكاوى" },
      plos: ["PLO5", "PLO6", "PLO1"],
      objectives: [
        { en: "Apologise and show understanding to an unhappy customer.", ar: "أعتذر وأُظهر التفهم للعميل غير الراضي." },
        { en: "Solve simple problems: a wrong price, a damaged or expired item.", ar: "أحل المشكلات البسيطة: سعر خاطئ، منتج تالف أو منتهي الصلاحية." },
        { en: "Refer the customer to a supervisor when needed.", ar: "أحوّل العميل إلى المشرف عند الحاجة." }
      ],
      context: {
        ar: "أحيانًا يكون العميل منزعجًا أو تكون هناك مشكلة: سعر مختلف، أو طابور طويل، أو منتج تالف. تتعلم هنا الاعتذار وإظهار التفهم، ثم الحل أو التحويل إلى المشرف بهدوء.",
        en: "Sometimes a customer is unhappy, or something has gone wrong."
      },
      words: [
        { en: "complaint", ar: "شكوى" },
        { en: "I'm sorry.", ar: "أنا آسف." },
        { en: "I understand.", ar: "أتفهم ذلك." },
        { en: "supervisor", ar: "مشرف" },
        { en: "wrong price", ar: "سعر خاطئ" },
        { en: "expired", ar: "منتهي الصلاحية" },
        { en: "damaged", ar: "تالف" },
        { en: "the difference", ar: "الفرق" }
      ],
      stages: [
        { id: "complaint", en: "Complaint", ar: "الشكوى" },
        { id: "sorry", en: "Apology", ar: "الاعتذار" },
        { id: "check", en: "Checking", ar: "التحقق" },
        { id: "solve", en: "Solution", ar: "الحل" },
        { id: "close", en: "Closing", ar: "الختام" }
      ],
      model: {
        title: { en: "The shelf price", ar: "سعر الرف" },
        setting: { en: "Supermarket till", ar: "كاشير سوبرماركت" },
        lines: [
          { s: "c", st: "complaint", en: "Excuse me. This price is wrong.", ar: "لو سمحت. هذا السعر خطأ." },
          { s: "c", st: "complaint", en: "The shelf says twenty-five, but you charged thirty-five.", ar: "على الرف خمسة وعشرون، لكنك حاسبتني بخمسة وثلاثين." },
          { s: "k", st: "sorry", en: "I'm sorry about that. Let me check the price.", ar: "آسف لذلك. دعني أتحقق من السعر." },
          { s: "k", st: "check", en: "You're right. The price is twenty-five riyals.", ar: "معك حق. السعر خمسة وعشرون ريالًا." },
          { s: "k", st: "solve", en: "I'll refund the difference. That's ten riyals.", ar: "سأعيد لك الفرق. عشرة ريالات." },
          { s: "c", st: "close", en: "Thank you.", ar: "شكرًا." },
          { s: "k", st: "close", en: "Sorry for the trouble. Have a nice day.", ar: "آسف على الإزعاج. يومك سعيد." }
        ]
      },
      phrases: [
        { id: "u6-01", f: "check", c: ["This price is wrong.", "The shelf price is different."], cAr: "هذا السعر خطأ.", k: "I'm sorry. Let me check the price.", kAr: "آسف. دعني أتحقق من السعر." },
        { id: "u6-02", f: "wait", c: ["Why is the line so slow?", "I've been waiting for ages."], cAr: "لماذا الطابور بطيء؟", k: "I'm sorry for the wait. I'll be as quick as I can.", kAr: "آسف على الانتظار. سأكون سريعًا قدر الإمكان." },
        { id: "u6-03", f: "replace", c: ["This is expired.", "Look at the date."], cAr: "هذا منتهي الصلاحية.", k: "I'm very sorry. I'll get you a fresh one.", kAr: "آسف جدًا. سأحضر لك واحدًا جديدًا." },
        { id: "u6-04", f: "replace", c: ["The box is damaged.", "This one is broken."], cAr: "العلبة تالفة.", k: "Sorry about that. Would you like another one?", kAr: "آسف. هل تريد واحدًا آخر؟" },
        { id: "u6-05", f: "manager", c: ["I want to speak to the manager.", "Call your manager, please."], cAr: "أريد التحدث إلى المدير.", k: "Of course. I'll call my supervisor now.", kAr: "بالتأكيد. سأستدعي المشرف الآن." },
        { id: "u6-06", f: "check", c: ["You charged me twice.", "I paid two times."], cAr: "حاسبتني مرتين.", k: "Let me check the receipt and the system.", kAr: "دعني أتحقق من الإيصال والنظام." },
        { id: "u6-07", f: "upset", gen: true, noR: true, c: ["This is unacceptable!", "I'm not happy."], cAr: "هذا غير مقبول!", k: "I understand, and I'm sorry. Let's fix this.", kAr: "أتفهم ذلك، وأنا آسف. دعنا نحل المشكلة." },
        { id: "u6-08", f: "discount", c: ["Can you give me a discount?", "Make it cheaper for me."], cAr: "هل تعطيني خصمًا؟", k: "Sorry, I can't change the price.", kAr: "عذرًا، لا أستطيع تغيير السعر." },
        { id: "u6-09", f: "machine", c: ["The card machine isn't working.", "The machine is broken."], cAr: "جهاز البطاقة لا يعمل.", k: "Sorry. You can pay at the next till.", kAr: "عذرًا. يمكنك الدفع عند الكاشير المجاور." },
        { id: "u6-10", f: "wait", c: ["I only have one item. Can I go first?", "Can I go before you?"], cAr: "معي منتج واحد. هل أتقدم؟", k: "Sorry, please wait in line. It won't be long.", kAr: "عذرًا، انتظر في الطابور من فضلك. لن يطول." },
        { id: "u6-11", f: "upset", gen: true, c: ["Nobody helped me.", "I asked three times."], cAr: "لم يساعدني أحد.", k: "I'm sorry about that. How can I help you now?", kAr: "آسف لذلك. كيف أستطيع مساعدتك الآن؟" },
        { id: "u6-12", f: "upset", gen: true, noR: true, c: ["Terrible service.", "I'll never shop here again."], cAr: "خدمة سيئة.", k: "I'm sorry you feel that way. I'll tell my manager.", kAr: "يؤسفني شعورك بذلك. سأبلغ مديري." },
        { id: "u6-13", f: "manager", c: ["Can I make a complaint?", "Where can I complain?"], cAr: "هل أستطيع تقديم شكوى؟", k: "Yes. You can fill in a form at customer service.", kAr: "نعم. يمكنك تعبئة نموذج في خدمة العملاء." }
      ],
      roleplay: {
        title: { en: "Waiting, and expired milk", ar: "الانتظار والحليب المنتهي" },
        setting: { en: "Supermarket till", ar: "كاشير سوبرماركت" },
        lines: [
          { s: "c", en: "Excuse me! I've been waiting for twenty minutes.", ar: "لو سمحت! أنتظر منذ عشرين دقيقة." },
          { s: "k", f: "wait", en: "I'm sorry for the wait. How can I help you?", ar: "آسف على الانتظار. كيف أستطيع مساعدتك؟" },
          { s: "c", en: "This milk is expired.", ar: "هذا الحليب منتهي الصلاحية." },
          { s: "k", f: "replace", en: "I'm very sorry. I'll get you a fresh one.", ar: "آسف جدًا. سأحضر لك واحدًا جديدًا." },
          { s: "c", en: "And the price on the shelf was lower.", ar: "والسعر على الرف كان أقل." },
          { s: "k", f: "check", en: "Let me check the price for you.", ar: "دعني أتحقق من السعر لك." },
          { s: "c", en: "I want to speak to the manager.", ar: "أريد التحدث إلى المدير." },
          { s: "k", f: "manager", en: "Of course. I'll call my supervisor now.", ar: "بالتأكيد. سأستدعي المشرف الآن." },
          { s: "c", en: "OK. Thank you.", ar: "حسنًا. شكرًا." },
          { s: "k", f: "close", en: "Thank you for your patience.", ar: "شكرًا على صبرك." }
        ]
      },
      watchOut: {
        note: "طلب العميل للمدير أمر طبيعي، فلا تأخذه بشكل شخصي.",
        items: [
          { en: "I'm sorry.", ar: "تعاطف مهذب، ولا تعني أنك أخطأت" },
          { en: "expired", ar: "منتهي الصلاحية" },
          { en: "expensive", ar: "غالٍ" }
        ],
        en: "“I'm sorry” shows understanding; it does not mean you made the mistake."
      },
      mission: {
        short: "لاحظ مشكلة حقيقية مع عميل، واكتب كيف تتعامل معها الآن.",
        ar: "لاحظ مشكلة حقيقية واحدة هذا الأسبوع (سعر، انتظار، منتج تالف). اكتب ما قاله العميل وما قلته أنت، ثم اكتب كيف تقولها بشكل أفضل الآن.",
        en: "Notice one real problem this week (a price, a wait, a damaged item). Write what the customer said and what you said, then how you would say it now."
      },
      workshop: {
        field: { ar: "شارك موقفًا صعبًا مع عميل. ما الكلمات التي ساعدت؟ وما التي لم تساعد؟", en: "Share a difficult moment with a customer. Which words helped, and which did not?" },
        joint: { ar: "يكتب الفصل حوار شكوى من سعر خاطئ فيه اعتذار وتحقق وحل.", en: "Co-write a wrong-price complaint with an apology, a check and a solution." },
        pairs: { ar: "بطاقات: عميل غاضب من الانتظار، منتج منتهي الصلاحية، طلب المدير. ثم يُجرى لعب الأدوار الختامي في نهاية الأسبوع.", en: "Cards: angry about the wait, an expired product, asks for the manager. The exit role-plays follow at the end of the week." }
      }
    }
  ],

  // ---------------------------------------------------------------------------
  // Listening check: two parallel forms with new sentences.
  // Part A: type the price you hear. Part B: choose what the customer wants.
  // ---------------------------------------------------------------------------
  listeningCheck: {
    entry: [
      { t: "price", plo: "PLO4", amount: 1300 },
      { t: "price", plo: "PLO4", amount: 4775 },
      { t: "price", plo: "PLO4", amount: 11550 },
      { t: "price", plo: "PLO4", amount: 1995 },
      { t: "price", plo: "PLO4", amount: 6000 },
      { t: "meaning", plo: "PLO2", en: "Excuse me, where can I find the shampoo?",
        options: ["يسأل عن مكان الشامبو", "يسأل عن سعر الشامبو", "يريد إرجاع الشامبو", "يسأل عن عرض على الشامبو"] },
      { t: "meaning", plo: "PLO3", en: "Do you have this jacket in a smaller size?",
        options: ["يريد مقاسًا أصغر", "يريد لونًا آخر", "يريد خصمًا", "يريد قياس الجاكيت"] },
      { t: "meaning", plo: "PLO4", en: "Can I pay half in cash and half by card?",
        options: ["يريد تقسيم الدفع بين النقد والبطاقة", "يريد الدفع بالبطاقة فقط", "يسأل عن الباقي", "يريد استخدام النقاط"] },
      { t: "meaning", plo: "PLO5", en: "I bought this yesterday, and it doesn't work.",
        options: ["المنتج الذي اشتراه لا يعمل", "يريد شراء منتج آخر", "يسأل متى يغلق المتجر", "يريد إيصالًا"] },
      { t: "meaning", plo: "PLO3", en: "Is this price with the discount?",
        options: ["يسأل هل السعر بعد الخصم", "يسأل هل السعر شامل الضريبة", "يطلب خصمًا إضافيًا", "يقول إن السعر خطأ"] }
    ],
    exit: [
      { t: "price", plo: "PLO4", amount: 3000 },
      { t: "price", plo: "PLO4", amount: 7425 },
      { t: "price", plo: "PLO4", amount: 15150 },
      { t: "price", plo: "PLO4", amount: 9095 },
      { t: "price", plo: "PLO4", amount: 1600 },
      { t: "meaning", plo: "PLO2", en: "Sorry, where are the batteries?",
        options: ["يسأل عن مكان البطاريات", "يسأل عن سعر البطاريات", "يريد إرجاع البطاريات", "يقول إن البطاريات نفدت"] },
      { t: "meaning", plo: "PLO3", en: "Have you got these trousers in a bigger size?",
        options: ["يريد مقاسًا أكبر", "يريد لونًا آخر", "يريد سعرًا أقل", "يريد غرفة القياس"] },
      { t: "meaning", plo: "PLO4", en: "Can I pay some by card and the rest in cash?",
        options: ["يريد تقسيم الدفع بين البطاقة والنقد", "يريد الدفع نقدًا فقط", "يسأل عن الرقم السري", "يريد إلغاء الدفع"] },
      { t: "meaning", plo: "PLO5", en: "I got this last week, and the screen is broken.",
        options: ["شاشة المنتج الذي اشتراه مكسورة", "يريد شاشة أكبر", "يسأل عن الضمان فقط", "يريد شراء شاشة"] },
      { t: "meaning", plo: "PLO3", en: "Does this price include the offer?",
        options: ["يسأل هل السعر يشمل العرض", "يسأل عن موعد العرض", "يريد عرضًا آخر", "يقول إن العرض انتهى"] }
    ]
  },

  // On-the-job help: tap to hear.
  quickHelp: [
    {
      group: { en: "When you don't understand", ar: "عندما لا تفهم" },
      items: [
        { en: "Sorry, could you say that again, please?", ar: "عذرًا، هل يمكنك إعادة ذلك من فضلك؟" },
        { en: "A little slower, please.", ar: "ببطء قليلًا من فضلك." },
        { en: "Do you mean thirteen or thirty?", ar: "هل تقصد 13 أم 30؟" },
        { en: "Could you show me, please?", ar: "هل يمكنك أن تريني من فضلك؟" },
        { en: "Could you write it down, please?", ar: "هل يمكنك كتابته من فضلك؟" }
      ]
    },
    {
      group: { en: "When you need time", ar: "عندما تحتاج وقتًا" },
      items: [
        { en: "One moment, please.", ar: "لحظة من فضلك." },
        { en: "Let me check for you.", ar: "دعني أتحقق لك." },
        { en: "Sorry for the wait.", ar: "آسف على الانتظار." }
      ]
    },
    {
      group: { en: "When you need help", ar: "عندما تحتاج مساعدة" },
      items: [
        { en: "I'll call my colleague.", ar: "سأنادي زميلي." },
        { en: "I'll call my supervisor.", ar: "سأستدعي المشرف." },
        { en: "Customer service can help you with that.", ar: "خدمة العملاء يمكنها مساعدتك في ذلك." },
        { en: "Sorry, I can't change the price.", ar: "عذرًا، لا أستطيع تغيير السعر." }
      ]
    },
    {
      group: { en: "At the till", ar: "عند الكاشير" },
      items: [
        { en: "Cash or card?", ar: "نقدًا أم بالبطاقة؟" },
        { en: "Please tap your card here.", ar: "قرّب بطاقتك هنا من فضلك." },
        { en: "It didn't go through. Please try again.", ar: "لم تتم العملية. حاول مرة أخرى من فضلك." },
        { en: "Here's your receipt. Have a nice day!", ar: "تفضل الإيصال. يومك سعيد!" }
      ]
    }
  ],

  // Words that trip up Arabic speakers in retail (interference).
  watchOut: [
    { a: "receipt", aAr: "إيصال", b: "recipe", bAr: "وصفة طبخ", note: "تُنطق «ريسيت»، وحرف `p` فيها لا يُنطق." },
    { a: "on sale", aAr: "عليه تخفيض", b: "for sale", bAr: "معروض للبيع", ex: [{ en: "This shirt is on sale.", ar: "هذا القميص عليه تخفيض." }] },
    { a: "change", aAr: "الباقي", b: "exchange", bAr: "استبدال", ex: [{ en: "Your change is 5 riyals.", ar: "الباقي 5 ريالات." }, { en: "I want to exchange this.", ar: "أريد استبدال هذا." }] },
    { a: "refund", aAr: "استرداد المبلغ", b: "exchange", bAr: "استبدال المنتج", note: "اسأل العميل:", ex: [{ en: "Would you like a refund or an exchange?", ar: "تريد استرداد المبلغ أم الاستبدال؟" }] },
    { a: "You're welcome.", aAr: "العفو", b: "Welcome!", bAr: "أهلًا بك", note: "ردًا على الشكر قل «العفو»، وليس «أهلًا بك».", ex: [{ en: "Thank you!", ar: "العميل يشكرك." }, { en: "You're welcome.", ar: "وأنت تردّ: العفو." }] },
    { a: "thirteen", aAr: "13", b: "thirty", bAr: "30", note: "في 13 يكون الضغط في آخر الكلمة، وفي 30 في أولها. وكذلك 14/40 و15/50 حتى 19/90.", ex: [{ en: "thir-TEEN", say: "thirteen", ar: "13" }, { en: "THIR-ty", say: "thirty", ar: "30" }] },
    { a: "card", aAr: "بطاقة", b: "cart", bAr: "عربة تسوق", note: "الأولى تنتهي بصوت «د»، والثانية بصوت «ت»." },
    { a: "bill", aAr: "فاتورة", b: "note", bAr: "ورقة نقدية", note: "وقد تسمع `bill` بمعنى الورقة النقدية أيضًا.", ex: [{ en: "Can I have the bill, please?", ar: "الفاتورة من فضلك." }, { en: "a 500-riyal note", ar: "ورقة نقدية من فئة 500 ريال" }] },
    { a: "aisle", aAr: "ممر", b: "", bAr: "", note: "تُنطق «آيل»، والسين لا تُنطق.", ex: [{ en: "It's in aisle 3.", ar: "إنه في الممر 3." }] },
    { a: "tap", aAr: "قرّب البطاقة", b: "insert", bAr: "أدخل البطاقة", ex: [{ en: "Please tap your card here.", ar: "قرّب بطاقتك من الجهاز." }, { en: "Please insert your card.", ar: "أدخل الشريحة في الفتحة." }] },
    { a: "points", aAr: "نقاط الولاء", b: "discount", bAr: "خصم", note: "النقاط تُجمع مع الوقت، والخصم تخفيض فوري على السعر." },
    { a: "cash back", aAr: "سحب نقدي عند الدفع", b: "refund", bAr: "استرداد", note: "أن يأخذ العميل نقودًا إضافية عند الدفع بالبطاقة، وليس استرجاع المال." },
    { a: "expired", aAr: "منتهي الصلاحية", b: "expensive", bAr: "غالٍ", ex: [{ en: "This milk is expired.", ar: "هذا الحليب منتهي الصلاحية." }] },
    { a: "ground floor", aAr: "الدور الأرضي", b: "first floor", bAr: "الدور الأول", note: "في السعودية وبريطانيا الدور الأول فوق الأرضي." }
  ],

  // Confusable number pairs for the numbers practice.
  confusables: [[13, 30], [14, 40], [15, 50], [16, 60], [17, 70], [18, 80], [19, 90]],

  // ---------------------------------------------------------------------------
  // Evaluation, planned from the start: who is asked, with what, and when.
  // ---------------------------------------------------------------------------
  evaluation: [
    { who: { en: "Two reviewers", ar: "مراجعان" }, what: { en: "Map the exit assessment to the outcomes independently; report agreement (app: Trainer › Alignment check)", ar: "يربطان التقييم الختامي بالمخرجات كلٌّ على حدة، ثم تُحسب نسبة الاتفاق" }, when: { en: "Before the pilot", ar: "قبل التجربة" } },
    { who: { en: "Learners", ar: "المتدربون" }, what: { en: "Listening check (entry form)", ar: "اختبار الاستماع (نموذج البداية)" }, when: { en: "Week 1", ar: "الأسبوع 1" } },
    { who: { en: "Trainers", ar: "المدربون" }, what: { en: "Diagnostic role-play, two raters, four criteria", ar: "لعب الأدوار التشخيصي بمقيّمَين وأربعة معايير" }, when: { en: "Week 1", ar: "الأسبوع 1" } },
    { who: { en: "Learners", ar: "المتدربون" }, what: { en: "Unit pulse: usefulness and difficulty of each unit", ar: "استطلاع قصير بعد كل وحدة: الفائدة والصعوبة" }, when: { en: "End of each unit", ar: "نهاية كل وحدة" } },
    { who: { en: "Learners and trainers", ar: "المتدربون والمدربون" }, what: { en: "Mission logs reviewed in the workshop", ar: "مراجعة سجلات المهام في الورشة" }, when: { en: "Weekly", ar: "أسبوعيًا" } },
    { who: { en: "Program team", ar: "فريق البرنامج" }, what: { en: "App usage: study time, steps completed, unit check scores (exported records)", ar: "بيانات الاستخدام: وقت الدراسة والخطوات ونتائج الوحدات (سجلات مُصدّرة)" }, when: { en: "Continuous", ar: "مستمر" } },
    { who: { en: "Trainers", ar: "المدربون" }, what: { en: "Exit role-plays, two raters, the same four criteria", ar: "لعب الأدوار الختامي بمقيّمَين وبالمعايير الأربعة نفسها" }, when: { en: "Week 6", ar: "الأسبوع 6" } },
    { who: { en: "Learners", ar: "المتدربون" }, what: { en: "Listening check (exit form) and end-of-program survey", ar: "اختبار الاستماع (نموذج النهاية) واستبانة نهاية البرنامج" }, when: { en: "Week 6", ar: "الأسبوع 6" } },
    { who: { en: "Store supervisors", ar: "مشرفو المتاجر" }, what: { en: "Short interview on English use at work; compare with a waiting-list group where possible", ar: "مقابلة قصيرة عن استخدام الإنجليزية في العمل، مع المقارنة بمجموعة انتظار إن أمكن" }, when: { en: "Week 6 and 4 weeks later", ar: "الأسبوع 6 وبعد 4 أسابيع" } }
  ],

  // Design summary shown on the program page (for instructors and trainers).
  design: {
    environment: [
      { en: "Learners: Saudi retail sales associates, Arabic L1, mostly A1–A2 in English, working shifts with little study time.", ar: "المتدربون: موظفو مبيعات سعوديون، لغتهم الأم العربية، ومستواهم غالبًا A1–A2، يعملون بنظام المناوبات ووقتهم للدراسة قليل." },
      { en: "Motivation: English is needed now, at work; tasks come straight from the shop floor.", ar: "الدافعية: الإنجليزية مطلوبة الآن في العمل، والمهام مأخوذة مباشرة من أرض المتجر." },
      { en: "Trainers: may not be trained in English for specific purposes, so the app carries a workshop guide and role-play cards for every unit.", ar: "المدربون: قد لا يكونون مدرَّبين على تعليم الإنجليزية لأغراض خاصة، لذا يتضمن التطبيق دليل ورشة وبطاقات أدوار لكل وحدة." },
      { en: "Class size varies, so workshops use pair role-plays; individual practice happens in the app.", ar: "يختلف عدد المتدربين، لذا تعتمد الورش على لعب الأدوار في أزواج، والتدريب الفردي في التطبيق." },
      { en: "Phones are the learners' main device; the app works offline after the first visit.", ar: "الجوال هو جهاز المتدرب الأساسي، والتطبيق يعمل دون اتصال بعد الزيارة الأولى." }
    ],
    needs: [
      { en: "Target situation: the service encounter, from greeting to closing, in English with non-Arabic-speaking customers.", ar: "الموقف المستهدف: حوار الخدمة من التحية إلى الختام بالإنجليزية مع عملاء لا يتحدثون العربية." },
      { en: "Necessities: greeting and offering help, finding products, describing products and prices, payment, returns and complaints.", ar: "الضرورات: الترحيب وعرض المساعدة، إرشاد العميل، وصف المنتجات والأسعار، الدفع، الإرجاع والشكاوى." },
      { en: "Lacks: hearing numbers (13/30), following fast or accented speech, polite formulas.", ar: "النواقص: سماع الأرقام (13/30)، ومتابعة الكلام السريع أو اللهجات المختلفة، والعبارات المهذبة." },
      { en: "Wants: confidence, and phrases ready to use on the next shift.", ar: "الرغبات: الثقة، وعبارات جاهزة للاستخدام في المناوبة التالية." }
    ],
    principles: [
      { en: "Frequency: the most frequent service phrases come first.", ar: "التكرار: العبارات الأكثر شيوعًا أولًا." },
      { en: "Four strands: every unit balances meaning-focused input, meaning-focused output, language-focused learning and fluency development.", ar: "المسارات الأربعة: كل وحدة توازن بين المدخلات والمخرجات ذات المعنى والتعلم اللغوي المركّز وتنمية الطلاقة." },
      { en: "Spaced retrieval: the review deck brings phrases back at growing intervals.", ar: "الاسترجاع المتباعد: بطاقات المراجعة تعيد العبارات على فترات متزايدة." },
      { en: "Interference: Watch Out notes target false friends and confusable numbers.", ar: "التداخل: ملاحظات «انتبه» تعالج الكلمات الخادعة والأرقام المتشابهة." },
      { en: "Time on task: short daily practice, tracked in the app.", ar: "وقت التعلم: تدريب يومي قصير يُسجَّل في التطبيق." },
      { en: "Feedback: immediate feedback on every item; rater feedback on role-plays.", ar: "التغذية الراجعة: فورية في كل سؤال، ومن المقيّمين في لعب الأدوار." },
      { en: "Ongoing needs analysis: mission logs and unit pulses feed the next revision.", ar: "تحليل الاحتياجات المستمر: سجلات المهام واستطلاعات الوحدات تغذي المراجعة التالية." }
    ],
    approach: {
      en: "Genre-based, text-based syllabus. Each unit takes one stage-structured service encounter and runs the teaching-learning cycle: building the field, modelling and deconstruction, joint construction, and independent construction. Support is withdrawn step by step.",
      ar: "منهج قائم على الجنس النصي (النص). تتناول كل وحدة حوار خدمة بمراحله، وتمر بدورة التعليم والتعلّم: بناء السياق، ثم النموذج وتحليله، ثم البناء المشترك، ثم البناء المستقل، مع سحب الدعم تدريجيًا."
    },
    references: [
      "Biggs, J. (1996). Enhancing teaching through constructive alignment. Higher Education, 32(3), 347–364.",
      "Feez, S. (1998). Text-based syllabus design. NCELTR, Macquarie University.",
      "Hasan, R. (1985). The structure of a text. In M. A. K. Halliday & R. Hasan, Language, context, and text (pp. 52–69). Deakin University Press.",
      "Hutchinson, T., & Waters, A. (1987). English for specific purposes: A learning-centred approach. Cambridge University Press.",
      "Macalister, J., & Nation, I. S. P. (2020). Language curriculum design (2nd ed.). Routledge."
    ]
  },

  // Learner feedback instruments.
  feedback: {
    survey: [
      { id: "s1", en: "The program helped me serve English-speaking customers.", ar: "ساعدني البرنامج على خدمة العملاء الذين يتحدثون الإنجليزية." },
      { id: "s2", en: "I used the English from the program at work.", ar: "استخدمت الإنجليزية التي تعلمتها في البرنامج أثناء العمل." },
      { id: "s3", en: "I feel more confident speaking with customers in English.", ar: "أشعر بثقة أكبر عند التحدث مع العملاء بالإنجليزية." },
      { id: "s4", en: "The weekly workshops were useful.", ar: "كانت الورش الأسبوعية مفيدة." },
      { id: "s5", en: "The app was easy to use.", ar: "كان التطبيق سهل الاستخدام." }
    ],
    open: [
      { id: "o1", en: "What helped you most?", ar: "ما أكثر شيء ساعدك؟" },
      { id: "o2", en: "What should we change?", ar: "ما الذي يجب أن نغيّره؟" }
    ]
  }
};
