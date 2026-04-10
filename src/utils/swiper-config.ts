import type { AstroSwiperOptions } from 'astro-swiper';

export const defaultSwiperOptions: AstroSwiperOptions = {
  rewind: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
};
