import { getPermalink } from './utils/permalinks';
import { SITE } from './config.mjs';

export const headerData = {
  links: [
    {
      text: 'Présentation',
      href: SITE.basePathname + '#presentation',
    },
    {
      text: 'Réalisations',
      href: SITE.basePathname + '#realisations',
    },
    {
      text: 'Contact',
      href: SITE.basePathname + '#contact',
    },
    {
      text: 'Avis clients',
      href: SITE.basePathname + '#avis-clients',
    },
  ],
  actions: [{ type: 'button', text: 'Téléphone', href: 'tel:+33630481737', icon: 'tabler:phone' }],
};

export const footerData = {
  // links: [
  //   {
  //     title: 'Plan du site',
  //     links: [
  //       { text: 'Présentation', href: SITE.basePathname + '#presentation' },
  //       { text: 'Réalisations', href: SITE.basePathname + '#realisations' },
  //       { text: 'Contact', href: SITE.basePathname + '#contact' },
  //       { text: 'Avis clients', href: SITE.basePathname + '#avis-cltermients' },
  //     ],
  //   },
  // ],
  secondaryLinks: [
    // { text: 'CGV', href: getPermalink('/cgv') },
    // { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Google Maps', icon: 'tabler:map-pin', href: 'https://goo.gl/maps/mDJCT3EZbiL9QHvw8' },
    { ariaLabel: 'Administration', icon: 'tabler:settings', href: SITE.origin + '/admin/index.html' },
    // { ariaLabel: 'Twitter', icon: 'tabler:brand-twitter', href: '#' },
    // { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
  ],
  footNote: `
    Site réalisé par <a class="text-primary hover:underline" href="https://linkedin.com/in/antoine-gervais">Antoine Gervais</a>.
  `,
};
