import type { FoodData } from './types.js';
interface FoodSearchParams {
    location: string;
    budget?: number;
}
declare class FoodService {
    private fetchFromGooglePlaces;
    private normalizeGooglePlacesFoodResponse;
    private getMockFood;
    searchFood(params: FoodSearchParams): Promise<FoodData[]>;
}
export declare const foodService: FoodService;
export {};
//# sourceMappingURL=food.service.d.ts.map