require("dotenv").config();
const axios = require("axios");

// Function to calculate distance between two coordinates in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return parseFloat(distance.toFixed(2));
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

async function getPlaceDetails(placeId, apiKey) {
  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,reviews,opening_hours&key=${apiKey}`;
  
  try {
    const response = await axios.get(detailsUrl);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching details for place ${placeId}:`, error.message);
    return null;
  }
}

async function fetchNearbyPetClinics(location) {
  const apiKey = process.env.GOOGLE_MAPS_API;
  const { lat, lng } = location;
  const radius = 10000; // in meters

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=pet+clinic+OR+pet+hospital&key=${apiKey}`;

  try {
    console.log('Requesting URL:', url);
    const response = await axios.get(url);
    
    let results = response.data.results || [];
    console.log(`Found ${results.length} results`);
    
    if (results.length === 0) {
      // Try with a larger radius if no results found
      const largerRadius = 5000;
      const newUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${largerRadius}&keyword=pet+clinic+OR+pet+hospital&key=${apiKey}`;
      console.log('Trying with larger radius:', newUrl);
      const newResponse = await axios.get(newUrl);
      results = newResponse.data.results || [];
      console.log(`Found ${results.length} results with larger radius`);
    }
    
    if (results.length === 0) {
      return [];
    }
    
    // Limit to top 10 results to avoid too many API calls
    const topResults = results.slice(0, 10);
    
    // Get detailed information for each place
    const clinicsWithDetails = await Promise.all(
      topResults.map(async (clinic) => {
        const details = await getPlaceDetails(clinic.place_id, apiKey);
        
        // Extract reviews if available
        const reviews = details?.reviews?.slice(0, 3).map(review => ({
          author_name: review.author_name,
          rating: review.rating,
          text: review.text
        })) || [];
        
        // Determine services based on name and types
        const services = ["General Care", "Vaccination"];
        if (clinic.name.toLowerCase().includes("surgery") || 
            clinic.name.toLowerCase().includes("hospital")) {
          services.push("Surgery");
        }
        if (clinic.name.toLowerCase().includes("emergency")) {
          services.push("Emergency Care");
        }
        
        // Calculate distance
        const clinicLat = clinic.geometry.location.lat;
        const clinicLng = clinic.geometry.location.lng;
        const distanceInKm = calculateDistance(lat, lng, clinicLat, clinicLng);
        
        return {
          hospital_name: clinic.name,
          hospital_address: clinic.vicinity,
          hospital_google_maps_link: `https://www.google.com/maps/place/?q=place_id:${clinic.place_id}`,
          distance_km: distanceInKm,
          contact_number: details?.formatted_phone_number || "Not available",
          rating: clinic.rating || null,
          reviews: reviews,
          open_hours: details?.opening_hours?.weekday_text || "Not available",
          services: services
        };
      })
    );

    // Sort by distance
    clinicsWithDetails.sort((a, b) => a.distance_km - b.distance_km);
    
    return clinicsWithDetails;
  } catch (error) {
    console.error("Google API error:", error.response?.data || error.message);
    return [];
  }
}

module.exports = fetchNearbyPetClinics;
