const GOOGLE_API_KEY = "";

export function getMapPreview(lat, lng) {
  const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${GOOGLE_API_KEY}`;
  return imagePreviewUrl;
}

export async function getAddress(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch address!");
  }

  const data = await response.json();
  const address = data.results[0].formatted_address;

  return address;
}

export async function calculateDistance(lat1, lon1, lat2, lon2) {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${lat1},${lon1}&destination=${lat2},${lon2}&key=${GOOGLE_API_KEY}`;

  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      const distance = data.routes[0].legs[0].distance.text; // Extract distance information
      return distance;
    } else {
      throw new Error("No routes found.");
    }
  }
}
