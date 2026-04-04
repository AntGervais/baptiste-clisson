import { useState, useEffect } from 'react';
import Review from './Review';
import type { Review as ReviewItem } from '~/types';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

type ReviewsProps = {
  initialReviews?: ReviewItem[]
}

type ReviewApiError = {
  error_message: string
}

export default function Reviews({ initialReviews }: ReviewsProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews || [])

  useEffect(() => {
    const getReviews = async () => {
      try {
        const result: ReviewItem[] | ReviewApiError = await fetch('/.netlify/functions/reviews').then((res) => res.json())
        if ('error_message' in result) {
          console.error(result)
        } else {
          setReviews((initialReviews) => {
            const filteredRes = result.filter((item: ReviewItem) => item.text && item.text.trim() !== '');
            return [...filteredRes, ...initialReviews];
          });
        }
      } catch (err) {
        throw err instanceof Error ? err : new Error(String(err));
      }
    }

    getReviews()
  }, [])

  return (<div
    className="relative"
  >
    <Swiper
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        1024: {
          slidesPerView: 2,
          spaceBetween: 30,
        }
      }}
      modules={[Navigation]}
      navigation={true}
      rewind={true}
    >
      {reviews ? <>
        {reviews.map((review) =>
          <SwiperSlide key={review.author_name}>
            <Review review={review} />
          </SwiperSlide>
        )}
      </> : null}
    </Swiper>
  </div>)
}
