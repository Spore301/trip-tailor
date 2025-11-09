import type { HotelData } from './types.js';
interface HotelSearchParams {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    budget?: number;
}
declare class HotelService {
    private fetchFromRapidAPI;
    private normalizeBookingResponse;
    private getMockHotels;
    searchHotels(params: HotelSearchParams): Promise<HotelData[]>;
}
export declare const hotelService: HotelService;
export {};
//# sourceMappingURL=hotel.service.d.ts.map