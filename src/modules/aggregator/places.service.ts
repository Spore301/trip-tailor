import axios from 'axios';
import type { PlaceData } from './types.js';
import { cacheService } from './cache.service.js';

interface PlacesSearchParams {
	location: string;
	type?: string;
	budget?: number;
}

class PlacesService {
	private async fetchFromGooglePlaces(params: PlacesSearchParams): Promise<PlaceData[]> {
		const apiKey = process.env.GOOGLE_PLACES_API_KEY;

		if (!apiKey) {
			throw new Error('Google Places API key not configured');
		}

		try {
			// Step 1: Get place ID from text search
			const textSearchResponse = await axios.get(
				'https://maps.googleapis.com/maps/api/place/textsearch/json',
				{
					params: {
						query: `tourist attractions in ${params.location}`,
						key: apiKey,
						type: 'tourist_attraction',
					},
				},
			);

			if (!textSearchResponse.data.results || textSearchResponse.data.results.length === 0) {
				return [];
			}

			// Get details for top places
			const placeIds = textSearchResponse.data.results.slice(0, 10).map((r: any) => r.place_id);

			const placesDetails = await Promise.all(
				placeIds.map((placeId: string) =>
					axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
						params: {
							place_id: placeId,
							key: apiKey,
							fields: 'name,formatted_address,rating,opening_hours,geometry,photos,types',
						},
					}),
				),
			);

			return this.normalizeGooglePlacesResponse(placesDetails.map((r) => r.data.result));
		} catch (error: any) {
			console.error('Google Places API error:', error.response?.data || error.message);
			throw error;
		}
	}

	private normalizeGooglePlacesResponse(data: any[]): PlaceData[] {
		return data.map((place: any) => {
			// Estimate cost based on rating and type (free to paid attractions)
			const baseCost = place.rating > 4 ? 500 : place.rating > 3 ? 200 : 0;
			const cost = baseCost + Math.floor(Math.random() * 500);

			return {
				name: place.name,
				description: place.formatted_address || 'Tourist attraction',
				estimated_cost: cost,
				type: 'attraction',
				...(place.geometry?.location && {
					location: {
						lat: place.geometry.location.lat,
						lng: place.geometry.location.lng,
					},
				}),
				rating: place.rating,
				opening_hours: place.opening_hours?.weekday_text?.join(', '),
				address: place.formatted_address,
				image_url: place.photos?.[0]
					? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
					: undefined,
				source: 'google',
			};
		});
	}

	private getMockPlaces(params: PlacesSearchParams): PlaceData[] {
		return [
			{
				name: 'Famous Temple',
				description: 'Historic religious site',
				estimated_cost: 0,
				type: 'attraction',
				rating: 4.5,
				source: 'google',
			},
			{
				name: 'Museum of Culture',
				description: 'Cultural heritage museum',
				estimated_cost: 300,
				type: 'attraction',
				rating: 4.2,
				source: 'google',
			},
			{
				name: 'Beach Viewpoint',
				description: 'Scenic beach location',
				estimated_cost: 0,
				type: 'attraction',
				rating: 4.7,
				source: 'google',
			},
			{
				name: 'Adventure Park',
				description: 'Thrilling adventure activities',
				estimated_cost: 800,
				type: 'attraction',
				rating: 4.3,
				source: 'google',
			},
			{
				name: 'Local Market',
				description: 'Traditional market for shopping',
				estimated_cost: 0,
				type: 'attraction',
				rating: 4.0,
				source: 'google',
			},
		];
	}

	async searchPlaces(params: PlacesSearchParams): Promise<PlaceData[]> {
		// Check cache first
		const cacheKey = cacheService.generateKey('places', params);
		const cached = cacheService.get<PlaceData[]>(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			// Try Google Places API first
			const places = await this.fetchFromGooglePlaces(params);
			cacheService.set(cacheKey, places);
			return places;
		} catch (error) {
			console.warn('Using mock places data due to API error');
			// Fallback to mock data
			const mockPlaces = this.getMockPlaces(params);
			cacheService.set(cacheKey, mockPlaces, 300); // Cache mock data for 5 minutes
			return mockPlaces;
		}
	}
}

export const placesService = new PlacesService();

