import axios from 'axios';
import { cacheService } from './cache.service.js';
class FoodService {
    async fetchFromGooglePlaces(params) {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        if (!apiKey) {
            throw new Error('Google Places API key not configured');
        }
        try {
            // Search for restaurants
            const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
                params: {
                    query: `restaurants in ${params.location}`,
                    key: apiKey,
                    type: 'restaurant',
                },
            });
            if (!response.data.results || response.data.results.length === 0) {
                return [];
            }
            // Get details for top restaurants
            const placeIds = response.data.results.slice(0, 10).map((r) => r.place_id);
            const restaurantsDetails = await Promise.all(placeIds.map((placeId) => axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
                params: {
                    place_id: placeId,
                    key: apiKey,
                    fields: 'name,formatted_address,rating,price_level,geometry,photos,types',
                },
            })));
            return this.normalizeGooglePlacesFoodResponse(restaurantsDetails.map((r) => r.data.result));
        }
        catch (error) {
            console.error('Google Places API error:', error.response?.data || error.message);
            throw error;
        }
    }
    normalizeGooglePlacesFoodResponse(data) {
        return data.map((restaurant) => {
            // Estimate cost based on price_level (0-4 scale)
            // price_level: 0 = free, 1 = inexpensive, 2 = moderate, 3 = expensive, 4 = very expensive
            const priceLevel = restaurant.price_level || 2;
            const costPerPerson = priceLevel === 0 ? 0 : priceLevel === 1 ? 200 : priceLevel === 2 ? 500 : priceLevel === 3 ? 1000 : 2000;
            // Extract cuisine type from types array
            const cuisineTypes = restaurant.types?.filter((t) => ['restaurant', 'food', 'meal_takeaway', 'cafe'].includes(t) === false);
            const cuisine = cuisineTypes?.[0]?.replace(/_/g, ' ') || 'Restaurant';
            return {
                name: restaurant.name,
                description: restaurant.formatted_address || 'Restaurant',
                estimated_cost: costPerPerson,
                type: 'food',
                cuisine: cuisine,
                price_level: priceLevel,
                ...(restaurant.geometry?.location && {
                    location: {
                        lat: restaurant.geometry.location.lat,
                        lng: restaurant.geometry.location.lng,
                    },
                }),
                rating: restaurant.rating,
                image_url: restaurant.photos?.[0]
                    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${restaurant.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
                    : undefined,
                source: 'google',
            };
        });
    }
    getMockFood(params) {
        return [
            {
                name: 'Local Street Food',
                description: 'Authentic local cuisine',
                estimated_cost: 150,
                type: 'food',
                cuisine: 'Local',
                price_level: 1,
                rating: 4.5,
                source: 'google',
            },
            {
                name: 'Fine Dining Restaurant',
                description: 'Upscale dining experience',
                estimated_cost: 1200,
                type: 'food',
                cuisine: 'International',
                price_level: 3,
                rating: 4.7,
                source: 'google',
            },
            {
                name: 'Café & Bakery',
                description: 'Casual café with baked goods',
                estimated_cost: 300,
                type: 'food',
                cuisine: 'Café',
                price_level: 2,
                rating: 4.3,
                source: 'google',
            },
            {
                name: 'Seafood Restaurant',
                description: 'Fresh seafood dishes',
                estimated_cost: 800,
                type: 'food',
                cuisine: 'Seafood',
                price_level: 2,
                rating: 4.4,
                source: 'google',
            },
        ];
    }
    async searchFood(params) {
        // Check cache first
        const cacheKey = cacheService.generateKey('food', params);
        const cached = cacheService.get(cacheKey);
        if (cached) {
            return cached;
        }
        try {
            // Try Google Places API first
            const food = await this.fetchFromGooglePlaces(params);
            cacheService.set(cacheKey, food);
            return food;
        }
        catch (error) {
            console.warn('Using mock food data due to API error');
            // Fallback to mock data
            const mockFood = this.getMockFood(params);
            cacheService.set(cacheKey, mockFood, 300); // Cache mock data for 5 minutes
            return mockFood;
        }
    }
}
export const foodService = new FoodService();
//# sourceMappingURL=food.service.js.map