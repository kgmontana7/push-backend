import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAchievementDefinitions as getThcstopAchievementDefinitions } from '../thcstop/src/content/achievementDefinitions.js';

export const SUPPORTED_LANGUAGES = ['nl', 'en', 'es', 'fr', 'de'];
export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_CURRENCY = 'EUR';

const LOCALE_BY_LANGUAGE = {
  nl: 'nl-NL',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
};

const THCSTOP_ACHIEVEMENTS = [
  ['money_1', 'money', 1],
  ['money_10', 'money', 10],
  ['grams_1', 'grams', 1],
  ['days_1', 'days', 1],
  ['joints_5', 'joints', 5],
  ['money_25', 'money', 25],
  ['days_2', 'days', 2],
  ['money_50', 'money', 50],
  ['days_5', 'days', 5],
  ['money_100', 'money', 100],
  ['joints_25', 'joints', 25],
  ['grams_10', 'grams', 10],
  ['days_7', 'days', 7],
  ['days_10', 'days', 10],
  ['joints_50', 'joints', 50],
  ['money_250', 'money', 250],
  ['days_14', 'days', 14],
  ['joints_100', 'joints', 100],
  ['days_21', 'days', 21],
  ['money_500', 'money', 500],
  ['grams_50', 'grams', 50],
  ['days_30', 'days', 30],
  ['joints_250', 'joints', 250],
  ['days_42', 'days', 42],
  ['money_1000', 'money', 1000],
  ['grams_100', 'grams', 100],
  ['joints_300', 'joints', 300],
  ['days_60', 'days', 60],
  ['joints_400', 'joints', 400],
  ['days_90', 'days', 90],
  ['days_100', 'days', 100],
  ['joints_500', 'joints', 500],
  ['money_2500', 'money', 2500],
  ['grams_250', 'grams', 250],
  ['days_150', 'days', 150],
  ['days_180', 'days', 180],
  ['joints_1000', 'joints', 1000],
  ['days_250', 'days', 250],
  ['money_5000', 'money', 5000],
  ['grams_500', 'grams', 500],
  ['days_270', 'days', 270],
  ['days_365', 'days', 365],
  ['joints_2000', 'joints', 2000],
  ['days_500', 'days', 500],
  ['money_10000', 'money', 10000],
  ['grams_1000', 'grams', 1000],
  ['days_730', 'days', 730],
  ['days_1000', 'days', 1000],
  ['joints_5000', 'joints', 5000],
  ['days_1095', 'days', 1095],
  ['money_25000', 'money', 25000],
  ['grams_2500', 'grams', 2500],
  ['days_1825', 'days', 1825],
  ['joints_10000', 'joints', 10000],
  ['grams_5000', 'grams', 5000],
  ['grams_7500', 'grams', 7500],
  ['grams_10000', 'grams', 10000],
];

const ALCOHOLSTOP_ACHIEVEMENTS = [
  ['saved_1', 'money', 1],
  ['saved_10', 'money', 10],
  ['units_1', 'units', 1],
  ['days_1', 'days', 1],
  ['drinks_5', 'drinks', 5],
  ['saved_25', 'money', 25],
  ['days_2', 'days', 2],
  ['saved_50', 'money', 50],
  ['days_5', 'days', 5],
  ['saved_100', 'money', 100],
  ['drinks_25', 'drinks', 25],
  ['units_10', 'units', 10],
  ['days_7', 'days', 7],
  ['days_10', 'days', 10],
  ['drinks_50', 'drinks', 50],
  ['saved_250', 'money', 250],
  ['days_14', 'days', 14],
  ['drinks_100', 'drinks', 100],
  ['days_21', 'days', 21],
  ['saved_500', 'money', 500],
  ['units_50', 'units', 50],
  ['days_30', 'days', 30],
  ['drinks_200', 'drinks', 200],
  ['days_42', 'days', 42],
  ['saved_1000', 'money', 1000],
  ['units_100', 'units', 100],
  ['drinks_300', 'drinks', 300],
  ['days_60', 'days', 60],
  ['drinks_400', 'drinks', 400],
  ['days_90', 'days', 90],
  ['days_100', 'days', 100],
  ['drinks_500', 'drinks', 500],
  ['saved_2500', 'money', 2500],
  ['units_250', 'units', 250],
  ['days_150', 'days', 150],
  ['days_180', 'days', 180],
  ['drinks_1000', 'drinks', 1000],
  ['days_250', 'days', 250],
  ['saved_5000', 'money', 5000],
  ['units_500', 'units', 500],
  ['days_270', 'days', 270],
  ['days_365', 'days', 365],
  ['drinks_2000', 'drinks', 2000],
  ['days_500', 'days', 500],
  ['saved_10000', 'money', 10000],
  ['units_1000', 'units', 1000],
  ['days_730', 'days', 730],
  ['days_1000', 'days', 1000],
  ['drinks_5000', 'drinks', 5000],
  ['days_1095', 'days', 1095],
  ['saved_25000', 'money', 25000],
  ['units_2500', 'units', 2500],
  ['days_1825', 'days', 1825],
  ['drinks_10000', 'drinks', 10000],
  ['units_5000', 'units', 5000],
  ['units_7500', 'units', 7500],
  ['units_10000', 'units', 10000],
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ALCOHOLSTOP_FUNCTION_BY_LANGUAGE = {
  nl: 'getAchievementDefinitionsNL',
  en: 'getAchievementDefinitionsEN',
  es: 'getAchievementDefinitionsES',
  fr: 'getAchievementDefinitionsFR',
  de: 'getAchievementDefinitionsDE',
};

const MOJIBAKE_PATTERN = /[ÃÂâðï]/;
const WINDOWS_1252_EXTENDED_MAP = {
  376: 159,
  338: 140,
  339: 156,
  352: 138,
  353: 154,
  381: 142,
  382: 158,
  402: 131,
  710: 136,
  732: 152,
  8211: 150,
  8212: 151,
  8216: 145,
  8217: 146,
  8218: 130,
  8220: 147,
  8221: 148,
  8222: 132,
  8224: 134,
  8225: 135,
  8226: 149,
  8230: 133,
  8240: 137,
  8249: 139,
  8250: 155,
  8364: 128,
  8482: 153,
};

let alcoholstopFactories = null;
const achievementCopyCache = new Map();

function toAchievements(records) {
  return records.map(([id, type, requirement]) => ({ id, type, requirement }));
}

function getElapsedDays(quitDateTime, now = new Date()) {
  const quitDate = new Date(quitDateTime);
  if (Number.isNaN(quitDate.getTime())) return 0;
  return Math.max(0, (now.getTime() - quitDate.getTime()) / (1000 * 60 * 60 * 24));
}

function formatCurrency(value, language, currency, whole = false) {
  return new Intl.NumberFormat(LOCALE_BY_LANGUAGE[language] || LOCALE_BY_LANGUAGE.en, {
    style: 'currency',
    currency: currency || DEFAULT_CURRENCY,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  })
    .format(Number(value || 0))
    .replace(/[\u202F\u00A0]/g, ' ');
}

function toWindows1252Byte(char) {
  const codePoint = char.charCodeAt(0);

  if (codePoint <= 255) {
    return codePoint;
  }

  return WINDOWS_1252_EXTENDED_MAP[codePoint] ?? 63;
}

function repairMojibake(value) {
  if (typeof value !== 'string' || !MOJIBAKE_PATTERN.test(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(Array.from(value), toWindows1252Byte);
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    return value;
  }
}

function normalizeIcon(icon, fallback) {
  const repaired = repairMojibake(icon);
  return repaired && !repaired.includes('�') ? repaired : fallback;
}

function getFallbackEmoji(appId, type) {
  if (appId === 'thcstop') {
    if (type === 'days') return '\u{1F4C5}';
    if (type === 'joints') return '\u{1F6AC}';
    if (type === 'grams') return '\u{1F33F}';
    if (type === 'money') return '\u{1F4B0}';
  }

  if (appId === 'alcoholstop') {
    if (type === 'days') return '\u{1F4C5}';
    if (type === 'drinks') return '\u{1F37B}';
    if (type === 'units') return '\u{1F4CF}';
    if (type === 'money') return '\u{1F4B0}';
  }

  return '\u{1F3C6}';
}

function loadAlcoholstopFactories() {
  if (alcoholstopFactories) return alcoholstopFactories;

  const mainSource = fs.readFileSync(
    path.resolve(__dirname, '../alcoholstop/src/components/milestones/achievementDefinitions.jsx'),
    'utf8',
  );
  const spanishSource = fs.readFileSync(
    path.resolve(__dirname, '../alcoholstop/src/components/milestones/achievementDefinitions-es.js'),
    'utf8',
  );
  const executableSource = `${mainSource}\n${spanishSource}`.replace(/export const /g, 'const ');

  alcoholstopFactories = new Function(
    `${executableSource}
return {
  getAchievementDefinitionsNL,
  getAchievementDefinitionsEN,
  getAchievementDefinitionsES,
  getAchievementDefinitionsFR,
  getAchievementDefinitionsDE,
};`,
  )();

  return alcoholstopFactories;
}

function getFrontendAchievementCopy(appId, language, currency) {
  const normalizedLanguage = normalizeLanguage(language);
  const normalizedCurrency = normalizeCurrency(currency);
  const cacheKey = `${appId}:${normalizedLanguage}:${normalizedCurrency}`;

  if (achievementCopyCache.has(cacheKey)) {
    return achievementCopyCache.get(cacheKey);
  }

  let definitions = [];

  if (appId === 'thcstop') {
    definitions = getThcstopAchievementDefinitions(normalizedLanguage, (amount) =>
      formatCurrency(amount, normalizedLanguage, normalizedCurrency, true),
    );
  } else if (appId === 'alcoholstop') {
    const factories = loadAlcoholstopFactories();
    const factoryName =
      ALCOHOLSTOP_FUNCTION_BY_LANGUAGE[normalizedLanguage] ||
      ALCOHOLSTOP_FUNCTION_BY_LANGUAGE[DEFAULT_LANGUAGE];
    definitions = factories[factoryName]((amount) =>
      formatCurrency(amount, normalizedLanguage, normalizedCurrency, false),
    );
  }

  const byId = new Map(
    definitions.map((definition) => [
      definition.id,
      {
        ...definition,
        title: repairMojibake(definition.title),
        description: repairMojibake(definition.description),
        icon: repairMojibake(definition.icon),
      },
    ]),
  );

  achievementCopyCache.set(cacheKey, byId);
  return byId;
}

function buildFallbackMessage(appId, achievement) {
  const emoji = getFallbackEmoji(appId, achievement.type);
  const appName = appId === 'thcstop' ? 'THC STOP' : 'ALCOHOL STOP';

  return {
    title: `${emoji} ${appName}`,
    body: achievement.id,
    emoji,
  };
}

function buildAchievementMessage(appId, achievement, language, currency) {
  try {
    const definition = getFrontendAchievementCopy(appId, language, currency).get(achievement.id);

    if (!definition) {
      return buildFallbackMessage(appId, achievement);
    }

    const emoji = normalizeIcon(definition.icon, getFallbackEmoji(appId, achievement.type));
    return {
      title: `${emoji} ${definition.title}`,
      body: definition.description,
      emoji,
    };
  } catch (error) {
    console.error(`Failed to build notification copy for ${appId}/${achievement.id}`, error);
    return buildFallbackMessage(appId, achievement);
  }
}

export const APP_DEFINITIONS = {
  thcstop: {
    appId: 'thcstop',
    displayName: 'THC STOP',
    routePage: 'Achievements',
    achievements: toAchievements(THCSTOP_ACHIEVEMENTS),
    getStats(profile, now = new Date()) {
      const totalDays = getElapsedDays(profile.quit_date_time, now);
      const jointsPerDay = Number(profile.joints_per_day) || 0;
      const gramsPerDay = Number(profile.grams_per_day) || 0;
      const pricePerGram = Number(profile.price_per_gram) || 0;

      return {
        days: totalDays,
        joints: totalDays * jointsPerDay,
        grams: totalDays * gramsPerDay,
        money: totalDays * gramsPerDay * pricePerGram,
      };
    },
    isProfileComplete(profile) {
      return Boolean(
        profile?.quit_date_time &&
          profile?.joints_per_day != null &&
          profile?.grams_per_day != null &&
          profile?.price_per_gram != null,
      );
    },
    buildMessage(achievement, language, currency) {
      return buildAchievementMessage(this.appId, achievement, language, currency);
    },
  },
  alcoholstop: {
    appId: 'alcoholstop',
    displayName: 'ALCOHOL STOP',
    routePage: 'Achievements',
    achievements: toAchievements(ALCOHOLSTOP_ACHIEVEMENTS),
    getStats(profile, now = new Date()) {
      const totalDays = getElapsedDays(profile.quit_date_time, now);
      const drinksPerDay = Number(profile.drinks_per_day) || 0;
      const unitsPerDay = Number(profile.units_per_day) || 0;
      const pricePerDrink = Number(profile.price_per_drink) || 0;

      return {
        days: totalDays,
        drinks: totalDays * drinksPerDay,
        units: totalDays * unitsPerDay,
        money: totalDays * drinksPerDay * pricePerDrink,
      };
    },
    isProfileComplete(profile) {
      return Boolean(
        profile?.quit_date_time &&
          profile?.drinks_per_day != null &&
          profile?.units_per_day != null &&
          profile?.price_per_drink != null,
      );
    },
    buildMessage(achievement, language, currency) {
      return buildAchievementMessage(this.appId, achievement, language, currency);
    },
  },
};

export function getAppDefinition(appId) {
  return APP_DEFINITIONS[appId] || null;
}

export function normalizeLanguage(language) {
  const normalized = String(language || DEFAULT_LANGUAGE).toLowerCase();
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : DEFAULT_LANGUAGE;
}

export function normalizeCurrency(currency) {
  const normalized = String(currency || DEFAULT_CURRENCY).toUpperCase();
  return normalized.length === 3 ? normalized : DEFAULT_CURRENCY;
}

export function extractLegacyProfile(appId, body = {}) {
  if (appId === 'thcstop') {
    return {
      quit_date_time: body.quit_date_time,
      joints_per_day: body.joints_per_day,
      grams_per_day: body.grams_per_day,
      price_per_gram: body.price_per_gram,
    };
  }

  if (appId === 'alcoholstop') {
    return {
      quit_date_time: body.quit_date_time,
      drinks_per_day: body.drinks_per_day,
      units_per_day: body.units_per_day,
      price_per_drink: body.price_per_drink,
    };
  }

  return null;
}
