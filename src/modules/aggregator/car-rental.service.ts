import axios from 'axios';
import type { CarRentalData } from './types.js';
import { cacheService } from './cache.service.js';

interface CarRentalSearchParams {
	location: string;
	pickUpDate: string;
	dropOffDate: string;
	pickUpTime?: string;
	dropOffTime?: string;
	driverAge?: number;
	budget?: number;
}

class CarRentalService {
	/**
	 * Get coordinates for a location (simplified - in production, use geocoding service)
	 */
	private async getLocationCoordinates(location: string): Promise<{ lat: number; lng: number }> {
		// For now, return default coordinates for common destinations
		// In production, integrate with Google Geocoding API or similar
		const locationMap: Record<string, { lat: number; lng: number }> = {
			bali: { lat: -8.3405, lng: 115.092 },
			mumbai: { lat: 19.076, lng: 72.8777 },
			delhi: { lat: 28.6139, lng: 77.209 },
			goa: { lat: 15.2993, lng: 74.124 },
			kerala: { lat: 10.8505, lng: 76.2711 },
			// Add more as needed
		};

		const normalizedLocation = location.toLowerCase();
		return locationMap[normalizedLocation] ?? locationMap['bali'] ?? { lat: -8.3405, lng: 115.092 }; // Default to Bali
	}

	private async fetchFromBookingCom(params: CarRentalSearchParams): Promise<CarRentalData[]> {
		const apiKey = process.env.RAPIDAPI_KEY;

		if (!apiKey) {
			throw new Error('RapidAPI key not configured');
		}

		try {
			// Get location coordinates
			const coordinates = await this.getLocationCoordinates(params.location);

			// Format times (default to 10:00 if not provided)
			const pickUpTime = params.pickUpTime || '10:00';
			const dropOffTime = params.dropOffTime || '10:00';
			const driverAge = params.driverAge || 30;

			// Make API call to Booking.com car rentals
			const response = await axios.get(
				'https://booking-com15.p.rapidapi.com/api/v1/cars/searchCarRentals',
				{
					headers: {
						'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
						'x-rapidapi-key': apiKey,
					},
					params: {
						pick_up_latitude: coordinates.lat,
						pick_up_longitude: coordinates.lng,
						drop_off_latitude: coordinates.lat, // Same location for round trip
						drop_off_longitude: coordinates.lng,
						pick_up_time: pickUpTime,
						drop_off_time: dropOffTime,
						pick_up_date: params.pickUpDate,
						drop_off_date: params.dropOffDate,
						driver_age: driverAge,
						currency_code: 'INR',
						location: 'IN',
					},
				},
			);

			return this.normalizeBookingComResponse(response.data, params, coordinates);
		} catch (error: any) {
			console.error('Booking.com Car Rental API error:', error.response?.data || error.message);
			throw error;
		}
	}

	private normalizeBookingComResponse(
		data: any,
		params: CarRentalSearchParams,
		coordinates: { lat: number; lng: number },
	): CarRentalData[] {
		if (!data.data || !Array.isArray(data.data)) {
			return [];
		}

		return data.data.slice(0, 10).map((rental: any) => {
			// Extract price (adjust based on actual API response structure)
			const price = rental.price?.total || rental.total_price || rental.price_per_day || 0;
			const currency = rental.currency || 'INR';

			// Convert to INR if needed (simplified conversion)
			let priceInINR = price;
			if (currency === 'USD') {
				priceInINR = price * 83; // Approximate conversion
			} else if (currency === 'EUR') {
				priceInINR = price * 90;
			}

			return {
				name: rental.car_name || rental.vehicle_name || rental.name || 'Car Rental',
				description: `${rental.car_type || 'Car'} - ${rental.supplier_name || 'Rental Company'}`,
				estimated_cost: Math.round(priceInINR),
				type: 'car_rental',
				pick_up_location: coordinates,
				drop_off_location: coordinates,
				pick_up_date: params.pickUpDate,
				drop_off_date: params.dropOffDate,
				pick_up_time: params.pickUpTime || '10:00',
				drop_off_time: params.dropOffTime || '10:00',
				car_type: rental.car_type || rental.vehicle_category,
				supplier: rental.supplier_name || rental.provider,
				driver_age: params.driverAge || 30,
				rating: rental.rating || rental.score,
				image_url: rental.image_url || rental.photo_url,
				source: 'booking',
			};
		});
	}

	private getMockCarRentals(params: CarRentalSearchParams): CarRentalData[] {
		const coordinates = { lat: -8.3405, lng: 115.092 }; // Default to Bali

		return [
			{
				name: 'Economy Car',
				description: 'Compact car suitable for city driving',
				estimated_cost: 2000,
				type: 'car_rental',
				pick_up_location: coordinates,
				drop_off_location: coordinates,
				pick_up_date: params.pickUpDate,
				drop_off_date: params.dropOffDate,
				pick_up_time: params.pickUpTime || '10:00',
				drop_off_time: params.dropOffTime || '10:00',
				car_type: 'Economy',
				supplier: 'Car Rental Co',
				driver_age: params.driverAge || 30,
				source: 'booking',
			},
			{
				name: 'SUV',
				description: 'Spacious SUV for family trips',
				estimated_cost: 4000,
				type: 'car_rental',
				pick_up_location: coordinates,
				drop_off_location: coordinates,
				pick_up_date: params.pickUpDate,
				drop_off_date: params.dropOffDate,
				pick_up_time: params.pickUpTime || '10:00',
				drop_off_time: params.dropOffTime || '10:00',
				car_type: 'SUV',
				supplier: 'Car Rental Co',
				driver_age: params.driverAge || 30,
				source: 'booking',
			},
			{
				name: 'Luxury Sedan',
				description: 'Premium sedan for comfortable travel',
				estimated_cost: 6000,
				type: 'car_rental',
				pick_up_location: coordinates,
				drop_off_location: coordinates,
				pick_up_date: params.pickUpDate,
				drop_off_date: params.dropOffDate,
				pick_up_time: params.pickUpTime || '10:00',
				drop_off_time: params.dropOffTime || '10:00',
				car_type: 'Luxury',
				supplier: 'Car Rental Co',
				driver_age: params.driverAge || 30,
				source: 'booking',
			},
		];
	}

	async searchCarRentals(params: CarRentalSearchParams): Promise<CarRentalData[]> {
		// Check cache first
		const cacheKey = cacheService.generateKey('car_rentals', params);
		const cached = cacheService.get<CarRentalData[]>(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			// Try Booking.com API first
			const rentals = await this.fetchFromBookingCom(params);
			cacheService.set(cacheKey, rentals);
			return rentals;
		} catch (error) {
			console.warn('Using mock car rental data due to API error');
			// Fallback to mock data
			const mockRentals = this.getMockCarRentals(params);
			cacheService.set(cacheKey, mockRentals, 300); // Cache mock data for 5 minutes
			return mockRentals;
		}
	}
}

export const carRentalService = new CarRentalService();

