import axios from 'axios';
import type { PlaceData } from './types.js';
import { cacheService } from './cache.service.js';

interface ActivitiesSearchParams {
	location: string;
	budget?: number;
}

class ActivitiesService {
	private async fetchFromBookingCom(params: ActivitiesSearchParams): Promise<PlaceData[]> {
		const apiKey = process.env.RAPIDAPI_KEY;

		if (!apiKey) {
			throw new Error('RapidAPI key not configured');
		}

		try {
			// Booking.com Activities API (adjust endpoint based on actual API)
			const response = await axios.get(
				'https://booking-com15.p.rapidapi.com/api/v1/attractions/searchAttractions',
				{
					headers: {
						'x-rapidapi-key': apiKey,
						'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
					},
					params: {
						location: params.location,
						currency: 'INR',
					},
				},
			);

			return this.normalizeBookingComResponse(response.data, params);
		} catch (error: any) {
			console.error('Booking.com Activities API error:', error.response?.data || error.message);
			throw error;
		}
	}

	private normalizeBookingComResponse(data: any, params: ActivitiesSearchParams): PlaceData[] {
		if (!data.data || !Array.isArray(data.data)) {
			return [];
		}

		return data.data.slice(0, 15).map((activity: any) => {
			// Extract price
			const price = activity.price?.amount || activity.price || activity.ticket_price || 0;
			const currency = activity.currency || 'INR';

			// Convert to INR if needed
			let priceInINR = price;
			if (currency === 'USD') {
				priceInINR = price * 83;
			} else if (currency === 'EUR') {
				priceInINR = price * 90;
			}

			return {
				name: activity.name || activity.title || 'Activity',
				description: activity.description || activity.short_description || 'Tourist attraction',
				estimated_cost: Math.round(priceInINR),
				type: 'attraction',
				...(activity.latitude &&
					activity.longitude && {
						location: {
							lat: parseFloat(activity.latitude),
							lng: parseFloat(activity.longitude),
						},
					}),
				rating: activity.rating || activity.score,
				address: activity.address || activity.location,
				opening_hours: activity.opening_hours || activity.hours,
				image_url: activity.image_url || activity.photo_url || activity.image,
				source: 'booking',
			};
		});
	}

	private getMockActivities(params: ActivitiesSearchParams): PlaceData[] {
		return [
			{
				name: 'Water Sports Adventure',
				description: 'Snorkeling and water activities',
				estimated_cost: 1500,
				type: 'attraction',
				rating: 4.5,
				source: 'booking',
			},
			{
				name: 'Temple Tour',
				description: 'Guided temple visit',
				estimated_cost: 500,
				type: 'attraction',
				rating: 4.3,
				source: 'booking',
			},
			{
				name: 'Sunset Cruise',
				description: 'Evening boat cruise',
				estimated_cost: 2000,
				type: 'attraction',
				rating: 4.7,
				source: 'booking',
			},
			{
				name: 'Cultural Show',
				description: 'Traditional dance performance',
				estimated_cost: 800,
				type: 'attraction',
				rating: 4.4,
				source: 'booking',
			},
			{
				name: 'Adventure Park',
				description: 'Thrilling adventure activities',
				estimated_cost: 2500,
				type: 'attraction',
				rating: 4.6,
				source: 'booking',
			},
		];
	}

	async searchActivities(params: ActivitiesSearchParams): Promise<PlaceData[]> {
		// Check cache first
		const cacheKey = cacheService.generateKey('activities', params);
		const cached = cacheService.get<PlaceData[]>(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			// Try Booking.com API first
			const activities = await this.fetchFromBookingCom(params);
			cacheService.set(cacheKey, activities);
			return activities;
		} catch (error) {
			console.warn('Using mock activities data due to API error');
			// Fallback to mock data
			const mockActivities = this.getMockActivities(params);
			cacheService.set(cacheKey, mockActivities, 300); // Cache mock data for 5 minutes
			return mockActivities;
		}
	}
}

export const activitiesService = new ActivitiesService();

