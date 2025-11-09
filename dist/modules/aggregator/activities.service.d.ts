import type { PlaceData } from './types.js';
interface ActivitiesSearchParams {
    location: string;
    budget?: number;
}
declare class ActivitiesService {
    private fetchFromBookingCom;
    private normalizeBookingComResponse;
    private getMockActivities;
    searchActivities(params: ActivitiesSearchParams): Promise<PlaceData[]>;
}
export declare const activitiesService: ActivitiesService;
export {};
//# sourceMappingURL=activities.service.d.ts.map