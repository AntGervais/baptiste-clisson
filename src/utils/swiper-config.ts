import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export { Swiper, Navigation, Pagination };

export const defaultSwiperOptions = {
  rewind: true,
  modules: [Navigation, Pagination],
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
};
