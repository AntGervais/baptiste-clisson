import { useState, useEffect } from 'react';
import PulseSpinner from '../common/PulseSpinner';
import Review from './Review';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

type ReviewsProps = {
  initialReviews?: Review[]
}

export default function Reviews({ initialReviews }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getReviews = async () => {
      setLoading(true)

      try {
        const res = await fetch('/.netlify/functions/reviews').then((res) => res.json())
        if ('error_message' in res) {
          console.error(res)
        } else {
          setReviews((initialReviews) => res.concat(initialReviews))
        }
      } catch (err) {
        throw new Error(err);
      }

      setLoading(false)
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
    >
      {reviews ? <>
        {reviews.map((review) =>
          <SwiperSlide>
            <Review review={review} />
          </SwiperSlide>
        )}
      </> : null}
    </Swiper>
    {loading && <div className="py-4 flex flex-col gap-4">
      <PulseSpinner />
    </div>}
  </div>)
}