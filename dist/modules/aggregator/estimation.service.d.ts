import type { Activity } from './types.js';
export interface CostEstimate {
    total: number;
    breakdown: {
        flights?: number;
        hotels?: number;
        attractions?: number;
        food?: number;
        activities?: number;
        car_rentals?: number;
    };
    perPerson?: number;
    perDay?: number;
}
export declare class EstimationService {
    calculateTotalCost(activities: Activity[], peopleCount: number, days: number): CostEstimate;
    filterByBudget(activities: Activity[], budget: number, peopleCount: number, days: number): Activity[];
}
export declare const estimationService: EstimationService;
//# sourceMappingURL=estimation.service.d.ts.map