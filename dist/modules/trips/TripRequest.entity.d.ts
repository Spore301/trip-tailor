import { ObjectId } from 'mongodb';
import { ExperienceType } from './types.js';
export declare class TripRequest {
    _id: ObjectId;
    destination: string;
    people_count: number;
    days: number;
    budget: number;
    experience: ExperienceType;
    created_at: Date;
    user_id?: ObjectId | null;
    itinerary_id?: ObjectId | null;
}
//# sourceMappingURL=TripRequest.entity.d.ts.map