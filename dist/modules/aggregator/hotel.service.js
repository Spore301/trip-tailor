import axios from 'axios';
import { cacheService } from './cache.service.js';
class HotelService {
    async fetchFromRapidAPI(params) {
        const apiKey = process.env.RAPIDAPI_KEY;
        if (!apiKey) {
            throw new Error('RapidAPI key not configured');
        }
        try {
            // Booking.com API via RapidAPI
            const response = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels', {
                headers: {
                    'x-rapidapi-key': apiKey,
                    'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
                },
                params: {
                    location: params.location,
                    checkin_date: params.checkIn,
                    checkout_date: params.checkOut,
                    adults_number: params.guests,
                    room_number: '1',
                    currency: 'INR',
                    order_by: 'popularity',
                },
            });
            return this.normalizeBookingResponse(response.data, params);
        }
        catch (error) {
            console.error('RapidAPI/Booking.com error:', error.response?.data || error.message);
            throw error;
        }
    }
    normalizeBookingResponse(data, params) {
        if (!data.result || !Array.isArray(data.result)) {
            return [];
        }
        return data.result.slice(0, 10).map((hotel) => {
            const price = hotel.price_breakdown?.gross_price?.value || hotel.min_total_price || 0;
            return {
                name: hotel.hotel_name || 'Unknown Hotel',
                description: hotel.distance_to_cc || hotel.review_score_word || 'Hotel',
                estimated_cost: Math.round(price * params.guests),
                type: 'hotel',
                check_in: params.checkIn,
                check_out: params.checkOut,
                guests: params.guests,
                rating: hotel.review_score ? hotel.review_score / 2 : undefined,
                location: hotel.latitude && hotel.longitude
                    ? {
                        lat: parseFloat(hotel.latitude),
                        lng: parseFloat(hotel.longitude),
                    }
                    : undefined,
                image_url: hotel.main_photo_url,
                source: 'booking',
            };
        });
    }
    getMockHotels(params) {
        const nights = Math.ceil((new Date(params.checkOut).getTime() - new Date(params.checkIn).getTime()) /
            (1000 * 60 * 60 * 24));
        return [
            {
                name: 'Luxury Resort',
                description: '5-star hotel in city center',
                estimated_cost: 5000 * nights * params.guests,
                type: 'hotel',
                check_in: params.checkIn,
                check_out: params.checkOut,
                guests: params.guests,
                rating: 4.5,
                source: 'booking',
            },
            {
                name: 'Budget Hotel',
                description: '3-star hotel near attractions',
                estimated_cost: 2000 * nights * params.guests,
                type: 'hotel',
                check_in: params.checkIn,
                check_out: params.checkOut,
                guests: params.guests,
                rating: 3.8,
                source: 'booking',
            },
            {
                name: 'Hostel',
                description: 'Budget-friendly accommodation',
                estimated_cost: 800 * nights * params.guests,
                type: 'hotel',
                check_in: params.checkIn,
                check_out: params.checkOut,
                guests: params.guests,
                rating: 3.5,
                source: 'booking',
            },
        ];
    }
    async searchHotels(params) {
        // Check cache first
        const cacheKey = cacheService.generateKey('hotels', params);
        const cached = cacheService.get(cacheKey);
        if (cached) {
            return cached;
        }
        try {
            // Try RapidAPI/Booking.com first
            const hotels = await this.fetchFromRapidAPI(params);
            cacheService.set(cacheKey, hotels);
            return hotels;
        }
        catch (error) {
            console.warn('Using mock hotel data due to API error');
            // Fallback to mock data
            const mockHotels = this.getMockHotels(params);
            cacheService.set(cacheKey, mockHotels, 300); // Cache mock data for 5 minutes
            return mockHotels;
        }
    }
}
export const hotelService = new HotelService();
//# sourceMappingURL=hotel.service.js.map