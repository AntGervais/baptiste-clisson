const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const prettier = require('prettier-plugin-tailwindcss');
const typo = require('@tailwindcss/typography');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--aw-color-primary)',
        secondary: 'var(--aw-color-secondary)',
        accent: 'var(--aw-color-accent)',
        beige: 'var(--aw-color-bg-beige)',
      },
      backgroundColor: {
        primary: 'var(--aw-color-primary)',
        secondary: 'var(--aw-color-secondary)',
        beige: 'var(--aw-color-bg-beige)',
      },
      fontFamily: {
        sans: ['Buenard', ...defaultTheme.fontFamily.sans],
        serif: ['Satisfy', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aw-font-heading)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [prettier, typo, colors],
};
