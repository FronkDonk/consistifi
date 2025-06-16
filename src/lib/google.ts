import { PlacesClient } from "@googlemaps/places";

export const placesClient = new PlacesClient({
  apiKey: process.env.GOOGLE_PLACES_API_KEY!,
});
