import type { PlaceData } from './types.js';
interface PlacesSearchParams {
    location: string;
    type?: string;
    budget?: number;
}
declare class PlacesService {
    private fetchFromGooglePlaces;
    private normalizeGooglePlacesResponse;
    private getMockPlaces;
    searchPlaces(params: PlacesSearchParams): Promise<PlaceData[]>;
}
export declare const placesService: PlacesService;
export {};
//# sourceMappingURL=places.service.d.ts.map