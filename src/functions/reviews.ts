import type { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_PLACE_ID } = process.env;

if (!GOOGLE_MAPS_API_KEY) {
  throw new Error('Missing GOOGLE_MAPS_API_KEY');
}
if (!GOOGLE_MAPS_PLACE_ID) {
  throw new Error('Missing GOOGLE_MAPS_PLACE_ID');
}
const headers = { 'Content-Type': 'application/json' };
const placesUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
const placesQuery = `${placesUrl}?place_id=${GOOGLE_MAPS_PLACE_ID}&key=${GOOGLE_MAPS_API_KEY}&reviews_sort=newest&fields=reviews`;

/**
 * Middleman function to fetch reviews from Google Places API because it
 * doesn't support CORS and this is much faster than using a proxy.
 */
const handler: Handler = async ({ httpMethod }) => {
  if (httpMethod !== 'GET') {
    console.error(`Method ${httpMethod} not allowed`);

    return {
      headers,
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }
  console.log(`placesQuery:`, placesQuery);
  return await fetch(placesQuery)
    .then((res) => res.json())
    .then((data: any) => {
      console.log(`data:`, data);
      return {
        headers,
        statusCode: 200,
        body: JSON.stringify(data.result?.reviews),
      };
    })
    .catch((err) => {
      console.error(err);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: (err as Error).message,
        }),
      };
    });
};

export { handler };
