import axios from 'axios';
import type { FlightData } from './types.js';
import { cacheService } from './cache.service.js';

interface FlightSearchParams {
	from: string;
	to: string;
	date: string;
	returnDate?: string;
	adults?: number;
}

class FlightService {
	private async fetchFromAmadeus(params: FlightSearchParams): Promise<FlightData[]> {
		const apiKey = process.env.AMADEUS_API_KEY;
		const apiSecret = process.env.AMADEUS_API_SECRET;

		if (!apiKey || !apiSecret) {
			throw new Error('Amadeus API credentials not configured');
		}

		try {
			// Step 1: Get access token
			const tokenResponse = await axios.post(
				'https://test.api.amadeus.com/v1/security/oauth2/token',
				new URLSearchParams({
					grant_type: 'client_credentials',
					client_id: apiKey,
					client_secret: apiSecret,
				}),
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				},
			);

			const accessToken = tokenResponse.data.access_token;

			// Step 2: Search flights
			const flightResponse = await axios.get(
				'https://test.api.amadeus.com/v2/shopping/flight-offers',
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
					params: {
						originLocationCode: params.from,
						destinationLocationCode: params.to,
						departureDate: params.date,
						adults: params.adults || 1,
						max: 10,
					},
				},
			);

			return this.normalizeAmadeusResponse(flightResponse.data);
		} catch (error: any) {
			console.error('Amadeus API error:', error.response?.data || error.message);
			throw error;
		}
	}

	private normalizeAmadeusResponse(data: any): FlightData[] {
		if (!data.data || !Array.isArray(data.data)) {
			return [];
		}

		return data.data.slice(0, 5).map((offer: any) => {
			const itinerary = offer.itineraries[0];
			const segment = itinerary.segments[0];
			const price = parseFloat(offer.price.total);

			return {
				name: `${segment.departure.iataCode} to ${segment.arrival.iataCode}`,
				description: `${offer.validatingAirlineCodes[0]} - ${segment.numberOfStops} stops`,
				estimated_cost: Math.round(price * 83), // Convert EUR to INR (approximate)
				type: 'flight',
				from: segment.departure.iataCode,
				to: segment.arrival.iataCode,
				departure_date: segment.departure.at,
				duration: this.calculateDuration(itinerary.duration),
				airline: offer.validatingAirlineCodes[0],
				source: 'amadeus',
			};
		});
	}

	private calculateDuration(duration: string): string {
		// Convert PT1H30M to "1h 30m"
		const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
		if (!match) return duration;
		const hours = match[1] || '0';
		const minutes = match[2] || '0';
		return `${hours}h ${minutes}m`;
	}

	private getMockFlights(params: FlightSearchParams): FlightData[] {
		return [
			{
				name: `${params.from} to ${params.to}`,
				description: 'Direct flight - Economy',
				estimated_cost: 15000,
				type: 'flight',
				from: params.from,
				to: params.to,
				departure_date: params.date,
				duration: '2h 30m',
				airline: 'IndiGo',
				source: 'amadeus',
			},
			{
				name: `${params.from} to ${params.to}`,
				description: '1 stop - Economy',
				estimated_cost: 12000,
				type: 'flight',
				from: params.from,
				to: params.to,
				departure_date: params.date,
				duration: '4h 15m',
				airline: 'SpiceJet',
				source: 'amadeus',
			},
		];
	}

	async searchFlights(params: FlightSearchParams): Promise<FlightData[]> {
		// Check cache first
		const cacheKey = cacheService.generateKey('flights', params);
		const cached = cacheService.get<FlightData[]>(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			// Try Amadeus API first
			const flights = await this.fetchFromAmadeus(params);
			cacheService.set(cacheKey, flights);
			return flights;
		} catch (error) {
			console.warn('Using mock flight data due to API error');
			// Fallback to mock data
			const mockFlights = this.getMockFlights(params);
			cacheService.set(cacheKey, mockFlights, 300); // Cache mock data for 5 minutes
			return mockFlights;
		}
	}
}

export const flightService = new FlightService();

