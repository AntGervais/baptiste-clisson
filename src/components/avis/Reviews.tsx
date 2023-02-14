import { useState, useEffect } from 'react';

const Reviews = ({ placeId }) => {

  const ApiKeyGoogleMaps = process.env.GOOGLE_MAPS_API_KEY;

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${ApiKeyGoogleMaps}&libraries=places`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));

      service.getDetails({ placeId }, (place, status) => {
        if (status === 'OK') {
          setReviews(place.reviews);
        }
      });
    };
  }, [placeId]);

  return (
    <div>
      {reviews.map((review) => (
        <div key={review.time}>
          <p>{review.text}</p>
          <p>By {review.author_name}</p>
          <p>Rating: {review.rating}</p>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
