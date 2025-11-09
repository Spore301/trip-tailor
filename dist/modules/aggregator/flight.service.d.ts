import type { FlightData } from './types.js';
interface FlightSearchParams {
    from: string;
    to: string;
    date: string;
    returnDate?: string;
    adults?: number;
}
declare class FlightService {
    private fetchFromAmadeus;
    private normalizeAmadeusResponse;
    private calculateDuration;
    private getMockFlights;
    searchFlights(params: FlightSearchParams): Promise<FlightData[]>;
}
export declare const flightService: FlightService;
export {};
//# sourceMappingURL=flight.service.d.ts.map