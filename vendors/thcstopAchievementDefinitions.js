const normalizeDeep = (value) => value;

const achievementBlueprints = {
  days: {
    requirements: [1, 3, 5, 10, 15, 21, 30, 45, 75, 120, 200, 350, 500, 1000],
    icons: ['1ï¸âƒ£', 'ðŸ•“', 'ðŸŒ¤ï¸', 'ðŸ§±', 'ðŸ—“ï¸', 'ðŸŒ…', 'ðŸŒŠ', 'ðŸ§ ', 'ðŸŒ¿', 'âœ¨', 'ðŸ', 'ðŸ§­', 'ðŸ”ï¸', 'ðŸŒŒ'],
    titles: {
      nl: [
        'Je bent begonnen',
        'Niet teruggedraaid',
        'De vaart zit erin',
        'Stevig bezig',
        'Dit begint echt te worden',
        'Je laat niet los',
        'Je staat nog steeds',
        'Rust in de tent',
        'Je hoofd komt mee',
        'Dit draag je nu',
        'Je nieuwe normaal',
        'Je hebt jezelf bewezen',
        'Ver voorbij het begin',
        'Bijna onvoorstelbaar',
      ],
      en: [
        'You started',
        'Still in it',
        'You found momentum',
        'Holding strong',
        'This is getting real',
        'You are not letting go',
        'Still standing',
        'A calmer rhythm',
        'Your mind is catching up',
        'You carry this now',
        'A new normal',
        'You proved it',
        'Far beyond the start',
        'Almost unreal',
      ],
      es: [
        'Ya empezaste',
        'Sigues en ello',
        'Ya tienes impulso',
        'Te mantienes firme',
        'Esto ya va en serio',
        'No lo estÃ¡s soltando',
        'Sigues de pie',
        'Un ritmo mÃ¡s tranquilo',
        'Tu cabeza acompaÃ±a',
        'Esto ya lo llevas contigo',
        'Un nuevo normal',
        'Te lo has demostrado',
        'Muy lejos del inicio',
        'Casi increÃ­ble',
      ],
      fr: [
        'Tu as commencÃ©',
        'Tu tiens',
        'Tu as trouvÃ© ton Ã©lan',
        'Tu tiens bon',
        'LÃ , Ã§a devient rÃ©el',
        'Tu ne lÃ¢ches pas',
        'Toujours debout',
        'Un rythme plus calme',
        'Ton esprit suit',
        'Tu portes Ã§a maintenant',
        'Un nouveau normal',
        'Tu te lâ€™es prouvÃ©',
        'Bien au-delÃ  du dÃ©but',
        'Presque irrÃ©el',
      ],
      de: [
        'Du hast angefangen',
        'Du bleibst dran',
        'Du hast Schwung',
        'Du hÃ¤ltst stark durch',
        'Jetzt wird es echt',
        'Du lÃ¤sst nicht los',
        'Du stehst noch',
        'Ein ruhigerer Rhythmus',
        'Dein Kopf zieht nach',
        'Das trÃ¤gst du jetzt',
        'Ein neues Normal',
        'Du hast es dir bewiesen',
        'Weit Ã¼ber den Anfang hinaus',
        'Kaum zu glauben',
      ],
    },
  },
  joints: {
    requirements: [1, 4, 8, 15, 25, 40, 60, 90, 125, 175, 250, 400, 700, 1200, 3000, 6000],
    icons: [
      'ðŸš­',
      'âœ‹',
      'ðŸ”',
      'ðŸŽ¯',
      'ðŸ’ª',
      'ðŸ›¡ï¸',
      'ðŸ§­',
      'ðŸŒ„',
      'âš¡',
      'ðŸ”ï¸',
      'ðŸš€',
      'ðŸŒŒ',
      'ðŸŒ ',
      'ðŸª',
      'ðŸ‘‘',
      'ðŸŒŸ',
    ],
    titles: {
      nl: [
        'Eerste nee',
        'Jij boven gewoonte',
        'Je kiest opnieuw',
        'Het patroon kraakt',
        'Dat tikt aan',
        'Je staat steviger',
        'De oude trek verliest',
        'Ver buiten routine',
        'Dit zit diep',
        'Dit ligt achter je',
        'Ongelooflijk eigenlijk',
        'Bijna niet meer van vroeger',
        'Je oude ritme vervaagt',
        'Een heel ander leven',
        'Dit heb je echt achter je gelaten',
        'Vrijwel niet meer wie je was',
      ],
      en: [
        'First no',
        'You over habit',
        'You choose again',
        'The pattern is cracking',
        'It is adding up',
        'You stand stronger',
        'The old pull is losing',
        'Well past routine',
        'This runs deep',
        'This is behind you now',
        'Kind of incredible',
        'That old life feels far away',
        'Your old rhythm is fading',
        'A very different life',
        'You really left this behind',
        'Almost not who you used to be',
      ],
      es: [
        'Primer no',
        'TÃº por encima del hÃ¡bito',
        'Vuelves a elegirte',
        'El patrÃ³n se estÃ¡ rompiendo',
        'Esto ya suma',
        'Te ves mÃ¡s firme',
        'El viejo tirÃ³n pierde fuerza',
        'Muy por fuera de la rutina',
        'Esto ya va muy hondo',
        'Esto va quedando atrÃ¡s',
        'La verdad, increÃ­ble',
        'Tu vida de antes ya se ve lejos',
        'Tu viejo ritmo se va borrando',
        'Una vida muy distinta',
        'De verdad lo dejaste atrÃ¡s',
        'Casi ya no eres quien eras antes',
      ],
      fr: [
        'Premier non',
        'Toi avant lâ€™habitude',
        'Tu te choisis encore',
        'Le schÃ©ma se fissure',
        'Ã‡a commence Ã  compter',
        'Tu tiens plus fort',
        'Lâ€™ancienne envie perd du terrain',
        'Bien au-delÃ  de la routine',
        'Ã‡a va dÃ©jÃ  trÃ¨s loin',
        'Ã‡a reste derriÃ¨re toi',
        'Franchement impressionnant',
        'Ton ancienne vie paraÃ®t loin',
        'Ton ancien rythme sâ€™efface',
        'Une vie trÃ¨s diffÃ©rente',
        'Tu as vraiment laissÃ© Ã§a derriÃ¨re toi',
        'Tu nâ€™es presque plus la personne dâ€™avant',
      ],
      de: [
        'Erstes Nein',
        'Du vor der Gewohnheit',
        'Du wÃ¤hlst dich wieder',
        'Das Muster bricht auf',
        'Das summiert sich',
        'Du stehst fester',
        'Der alte Zug verliert an Kraft',
        'Weit Ã¼ber die Routine hinaus',
        'Das geht schon tief',
        'Das liegt jetzt hinter dir',
        'Eigentlich unglaublich',
        'Das alte Leben fÃ¼hlt sich weit weg an',
        'Der alte Rhythmus verblasst',
        'Ein ganz anderes Leben',
        'Das hast du wirklich hinter dir gelassen',
        'Fast nicht mehr die Person von frÃ¼her',
      ],
    },
  },
  grams: {
    requirements: [1, 3, 5, 10, 20, 35, 50, 75, 100, 150, 250, 400, 700, 1200, 2000, 3000],
    icons: [
      'ðŸŒ±',
      'ðŸŒ¿',
      'ðŸƒ',
      'ðŸ“¦',
      'âš–ï¸',
      'ðŸ§®',
      'ðŸŒ¾',
      'ðŸŽ’',
      'ðŸª¨',
      'ðŸ§±',
      'ðŸŒ„',
      'ðŸŒ',
      'ðŸª',
      'ðŸŒ ',
      'ðŸ”ï¸',
      'âœ¨',
    ],
    titles: {
      nl: [
        'De eerste is weg',
        'Het begint te tellen',
        'Meer dan een begin',
        'Dat wordt serieus',
        'Je voelt het verschil',
        'Je laat echt iets liggen',
        'Dat is geen kleinigheid meer',
        'Het stapelt serieus op',
        'Je laat echt veel liggen',
        'Dat weegt inmiddels',
        'Ver voorbij vroeger',
        'Dit is echt groot geworden',
        'Bijna niet te bevatten',
        'Het krijgt echt omvang',
        'Verder dan je ooit dacht',
        'Dit is een enorme stapel',
      ],
      en: [
        'The first one is gone',
        'It starts to count',
        'Past the first push',
        'Now we are talking',
        'You can feel the difference',
        'You are really leaving it behind',
        'That is no small amount',
        'This is adding up for real',
        'You have left a lot behind',
        'It carries weight now',
        'Well beyond the old days',
        'This has become something big',
        'Hard to even picture',
        'This is getting real scale',
        'Further than you imagined',
        'This is a massive total',
      ],
      es: [
        'El primero ya quedÃ³ atrÃ¡s',
        'Empieza a contar',
        'Ya pasaste el arranque',
        'Esto ya va en serio',
        'Ya se nota la diferencia',
        'De verdad lo estÃ¡s dejando atrÃ¡s',
        'Eso ya no es poca cosa',
        'Esto ya se acumula de verdad',
        'Has dejado mucho atrÃ¡s',
        'Esto ya pesa de verdad',
        'Muy lejos de tus dÃ­as de antes',
        'Esto ya se volviÃ³ enorme',
        'Cuesta hasta imaginarlo',
        'Esto ya tiene mucha dimensiÃ³n',
        'MÃ¡s lejos de lo que imaginabas',
        'Esto ya es una enormidad',
      ],
      fr: [
        'Le premier est derriÃ¨re toi',
        'Ã‡a commence Ã  compter',
        'Tu as passÃ© le premier Ã©lan',
        'LÃ , Ã§a devient sÃ©rieux',
        'La diffÃ©rence se sent',
        'Tu le laisses vraiment derriÃ¨re toi',
        'Ce nâ€™est plus rien du tout',
        'LÃ , Ã§a sâ€™accumule vraiment',
        'Tu as dÃ©jÃ  laissÃ© beaucoup derriÃ¨re toi',
        'Ã‡a commence vraiment Ã  peser',
        'Bien au-delÃ  de ton ancienne routine',
        'Ã‡a a vraiment pris de lâ€™ampleur',
        'Câ€™est presque difficile Ã  imaginer',
        'LÃ , Ã§a prend vraiment de la place',
        'Bien plus loin que tu lâ€™imaginais',
        'Câ€™est devenu une somme Ã©norme',
      ],
      de: [
        'Das erste ist geschafft',
        'Es beginnt zu zÃ¤hlen',
        'Du bist Ã¼ber den ersten Schub hinaus',
        'Jetzt wird es ernst',
        'Du merkst den Unterschied',
        'Du lÃ¤sst es wirklich hinter dir',
        'Das ist nicht mehr wenig',
        'Das summiert sich jetzt deutlich',
        'Du hast schon viel hinter dir gelassen',
        'Das hat inzwischen Gewicht',
        'Weit weg von der alten Zeit',
        'Das ist inzwischen wirklich groÃŸ',
        'Kaum noch vorstellbar',
        'Das nimmt jetzt richtig AusmaÃŸ an',
        'Weiter als du je gedacht hast',
        'Das ist inzwischen eine enorme Menge',
      ],
    },
  },
  money: {
    requirements: [
      5, 12, 25, 45, 80, 150, 275, 450, 700, 1000, 1500, 2500, 4000, 6500, 10000, 20000,
    ],
    icons: [
      'â˜•',
      'ðŸ’µ',
      'ðŸ’¸',
      'ðŸ§¾',
      'ðŸ¦',
      'ðŸª™',
      'ðŸ’°',
      'ðŸ“ˆ',
      'ðŸ—ï¸',
      'ðŸš€',
      'ðŸŒŸ',
      'ðŸ’Ž',
      'ðŸ›ï¸',
      'ðŸ‘‘',
      'âœ¨',
      'ðŸŒ ',
    ],
    titles: {
      nl: [
        'Eerste geld terug',
        'Houden zo',
        'Dit voelt al anders',
        'Mooi meegenomen',
        'Je merkt het echt',
        'Dat blijft bij jou',
        'Dit begint ergens op te lijken',
        'Dit staat stevig',
        'Dat is serieus geld',
        'Sterk teruggepakt',
        'Dit verandert echt iets',
        'Het begint groot te worden',
        'Dat loopt echt op',
        'Dit is serieus opgebouwd',
        'Een enorme winst',
        'Dat is een gigantische stap',
      ],
      en: [
        'First money back',
        'Keep it going',
        'This already feels different',
        'Nice to keep',
        'You can really feel it now',
        'That stays with you',
        'Now it looks real',
        'This stands on its own',
        'That is serious money',
        'A serious reclaim',
        'This changes things',
        'This is getting big',
        'It is really adding up',
        'This has been built for real',
        'A huge win',
        'That is a massive leap',
      ],
      es: [
        'Primer dinero de vuelta',
        'Sigue asÃ­',
        'Esto ya se siente distinto',
        'Nada mal',
        'Ahora sÃ­ se siente de verdad',
        'Eso se queda contigo',
        'Ahora ya se nota de verdad',
        'Esto ya se sostiene solo',
        'Eso ya es dinero de verdad',
        'Una gran recuperaciÃ³n',
        'Esto sÃ­ cambia las cosas',
        'Esto ya se estÃ¡ haciendo grande',
        'De verdad se estÃ¡ acumulando',
        'Esto ya estÃ¡ muy bien construido',
        'Una ganancia enorme',
        'Eso ya es un salto gigante',
      ],
      fr: [
        'Premier argent rÃ©cupÃ©rÃ©',
        'Continue comme Ã§a',
        'Ã‡a commence Ã  changer',
        'Toujours bon Ã  prendre',
        'LÃ , tu le sens vraiment',
        'Ã‡a reste pour toi',
        'LÃ , Ã§a devient concret',
        'Ã‡a tient vraiment debout',
        'LÃ , câ€™est une vraie somme',
        'Une vraie reprise',
        'Ã‡a change vraiment quelque chose',
        'LÃ , Ã§a devient grand',
        'Ã‡a sâ€™accumule vraiment',
        'Câ€™est quelque chose de solidement construit',
        'Une Ã©norme victoire',
        'Câ€™est un cap immense',
      ],
      de: [
        'Erstes Geld zurÃ¼ck',
        'Weiter so',
        'Das fÃ¼hlt sich schon anders an',
        'Kann sich sehen lassen',
        'Jetzt merkst du es wirklich',
        'Das bleibt bei dir',
        'Jetzt wird es greifbar',
        'Das steht inzwischen fÃ¼r sich',
        'Das ist richtig Geld',
        'Stark zurÃ¼ckgeholt',
        'Das verÃ¤ndert wirklich etwas',
        'Das wird jetzt richtig groÃŸ',
        'Das summiert sich wirklich',
        'Das ist jetzt solide aufgebaut',
        'Ein riesiger Gewinn',
        'Das ist ein gewaltiger Sprung',
      ],
    },
  },
};

const localeMap = {
  nl: 'nl-NL',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
};

function buildAchievements() {
  return Object.entries(achievementBlueprints).flatMap(([type, config]) =>
    config.requirements.map((requirement, index) => ({
      type,
      requirement,
      icon: config.icons[index],
      title: Object.fromEntries(
        Object.entries(config.titles).map(([language, titles]) => [language, titles[index]]),
      ),
    })),
  );
}

const achievements = buildAchievements();

function formatCount(language, value) {
  return new Intl.NumberFormat(localeMap[language] || localeMap.en).format(value);
}

function formatMoneyAmount(language, value, formatWholeCurrency) {
  if (typeof formatWholeCurrency === 'function') {
    return formatWholeCurrency(value);
  }

  return new Intl.NumberFormat(localeMap[language] || localeMap.en, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatWeightAmount(language, value) {
  const formatter = new Intl.NumberFormat(localeMap[language] || localeMap.en, {
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  });

  if (value >= 1000) {
    const kilos = value / 1000;

    switch (language) {
      case 'nl':
        return `${formatter.format(kilos)} kilo`;
      case 'es':
      case 'fr':
        return `${formatter.format(kilos)} kilos`;
      case 'de':
        return `${formatter.format(kilos)} Kilo`;
      default:
        return `${formatter.format(kilos)} kilos`;
    }
  }

  switch (language) {
    case 'nl':
      return `${formatter.format(value)} gram`;
    case 'es':
      return `${formatter.format(value)} gramos`;
    case 'fr':
      return `${formatter.format(value)} grammes`;
    case 'de':
      return `${formatter.format(value)} Gramm`;
    default:
      return `${formatter.format(value)} grams`;
  }
}

function getDescription(language, type, requirement, formatWholeCurrency) {
  const count = formatCount(language, requirement);
  const weight = formatWeightAmount(language, requirement);
  const money = formatMoneyAmount(language, requirement, formatWholeCurrency);

  switch (language) {
    case 'nl':
      if (type === 'days') return `Je bent ${count} dag${requirement === 1 ? '' : 'en'} THC-vrij!`;
      if (type === 'joints')
        return `Je hebt ${count} joint${requirement === 1 ? '' : 's'} vermeden!`;
      if (type === 'grams') return `Je hebt ${weight} vermeden!`;
      return `Je hebt ${money} bespaard!`;
    case 'es':
      if (type === 'days') return `Llevas ${count} dÃ­a${requirement === 1 ? '' : 's'} sin THC!`;
      if (type === 'joints') return `Has evitado ${count} porro${requirement === 1 ? '' : 's'}!`;
      if (type === 'grams') return `Has evitado ${weight}!`;
      return `Has ahorrado ${money}!`;
    case 'fr':
      if (type === 'days')
        return `Tu es sans THC depuis ${count} jour${requirement === 1 ? '' : 's'} !`;
      if (type === 'joints') return `Tu as Ã©vitÃ© ${count} joint${requirement === 1 ? '' : 's'} !`;
      if (type === 'grams') return `Tu as Ã©vitÃ© ${weight} !`;
      return `Tu as Ã©conomisÃ© ${money} !`;
    case 'de':
      if (type === 'days')
        return `Du bist seit ${count} Tag${requirement === 1 ? '' : 'en'} THC-frei!`;
      if (type === 'joints')
        return `Du hast ${count} Joint${requirement === 1 ? '' : 's'} vermieden!`;
      if (type === 'grams') return `Du hast ${weight} vermieden!`;
      return `Du hast ${money} gespart!`;
    default:
      if (type === 'days')
        return `You have been THC-free for ${count} day${requirement === 1 ? '' : 's'}!`;
      if (type === 'joints') return `You avoided ${count} joint${requirement === 1 ? '' : 's'}!`;
      if (type === 'grams') return `You avoided ${weight}!`;
      return `You saved ${money}!`;
  }
}

export function getAchievementDefinitions(language, formatWholeCurrency) {
  return normalizeDeep(
    achievements.map((achievement) => ({
      id: `${achievement.type}_${achievement.requirement}`,
      type: achievement.type,
      requirement: achievement.requirement,
      icon: achievement.icon,
      title: achievement.title[language] || achievement.title.en,
      description: getDescription(
        language,
        achievement.type,
        achievement.requirement,
        formatWholeCurrency,
      ),
    })),
  );
}
