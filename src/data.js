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
  links: [
    {
      title: 'Services',
      links: [
        { text: 'Charpente & Rénovation', href: getPermalink('/charpente-renovation') },
        { text: 'Escaliers sur-mesure', href: getPermalink('/escaliers') },
        { text: 'Extension & Ossature', href: getPermalink('/extension-ossature') },
      ],
    },
    {
      title: 'Entreprise',
      links: [
        { text: 'Réalisations', href: getPermalink('/realisations') },
        { text: 'Avis clients', href: getPermalink('/#avis-clients') },
        { text: 'Contact', href: getPermalink('/#contact') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Mentions Légales', href: getPermalink('/mentions-legales') },
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
