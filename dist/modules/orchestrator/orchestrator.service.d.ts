import type { FlightData, HotelData, PlaceData, FoodData, CarRentalData } from '../aggregator/types.js';
import { ExperienceType } from '../trips/types.js';
export interface TripRequestParams {
    destination: string;
    days: number;
    people_count: number;
    budget: number;
    experience: ExperienceType;
}
export interface FilteredTripData {
    flights: FlightData[];
    hotels: HotelData[];
    car_rentals: CarRentalData[];
    places: PlaceData[];
    food: FoodData[];
    totalEstimatedCost: number;
    budgetRemaining: number;
    budgetAllocation: {
        flights: number;
        hotels: number;
        car_rentals: number;
        activities: number;
        food: number;
    };
}
declare class OrchestratorService {
    /**
     * Get budget allocation based on experience type
     */
    private getBudgetAllocation;
    /**
     * Filter flights by budget and prioritize by experience type
     */
    private filterFlights;
    /**
     * Filter hotels by budget and experience type
     */
    private filterHotels;
    /**
     * Filter places by budget and experience type
     */
    private filterPlaces;
    /**
     * Filter food by budget and experience type
     */
    private filterFood;
    /**
     * Filter car rentals by budget and experience type
     */
    private filterCarRentals;
    /**
     * Main orchestration method - aggregates and filters all data
     */
    aggregateAndFilter(params: TripRequestParams): Promise<FilteredTripData>;
}
export declare const orchestratorService: OrchestratorService;
export {};
//# sourceMappingURL=orchestrator.service.d.ts.map