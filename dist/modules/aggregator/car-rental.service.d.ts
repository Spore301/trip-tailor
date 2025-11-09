import type { CarRentalData } from './types.js';
interface CarRentalSearchParams {
    location: string;
    pickUpDate: string;
    dropOffDate: string;
    pickUpTime?: string;
    dropOffTime?: string;
    driverAge?: number;
    budget?: number;
}
declare class CarRentalService {
    /**
     * Get coordinates for a location (simplified - in production, use geocoding service)
     */
    private getLocationCoordinates;
    private fetchFromBookingCom;
    private normalizeBookingComResponse;
    private getMockCarRentals;
    searchCarRentals(params: CarRentalSearchParams): Promise<CarRentalData[]>;
}
export declare const carRentalService: CarRentalService;
export {};
//# sourceMappingURL=car-rental.service.d.ts.map