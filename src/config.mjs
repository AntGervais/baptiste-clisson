import defaultImage from './../public/images/default.png';

const CONFIG = {
  name: 'Charpente Bois Debout',

  origin: 'https://charpenteboisdebout.fr',
  basePathname: '/',
  trailingSlash: false,

  title: 'Charpente Bois Debout — Artisan Charpentier à Saulgé (86) - Baptiste Clisson',
  description:
    'Entreprise de Charpentes traditionnelles - Ossatures et planchers bois - Escaliers massifs sur mesure. Rénovation du bâti ancien.',
  defaultImage: defaultImage,

  defaultTheme: 'system', // Values: "system" | "light" | "dark" | "light:only" | "dark:only"

  language: 'fr',
  textDirection: 'ltr',

  dateFormatter: new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }),

  googleAnalyticsId: false, // or "G-XXXXXXXXXX",
  googleSiteVerificationId: 'orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M',

  realisations: {
    disabled: false,
    postsPerPage: 5,

    post: {
      permalink: '/%slug%', // Variables: %slug%, %year%, %month%, %day%, %hour%, %minute%, %second%
      noindex: false,
      disabled: false,
    },

    list: {
      pathname: 'realisations', // realisation main path, you can change this to "articles" (/articles)
      noindex: false,
      disabled: false,
    },

    tag: {
      pathname: 'tag', // Tag main path /tag/some-tag
      noindex: true,
      disabled: false,
    },
  },
};

export const SITE = { ...CONFIG, realisations: undefined };
export const REALISATIONS = CONFIG.realisations;
export const DATE_FORMATTER = CONFIG.dateFormatter;
