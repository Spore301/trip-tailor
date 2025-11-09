var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ObjectIdColumn } from 'typeorm';
import { ExperienceType } from './types.js';
let TripRequest = class TripRequest {
};
__decorate([
    ObjectIdColumn(),
    __metadata("design:type", ObjectId)
], TripRequest.prototype, "_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], TripRequest.prototype, "destination", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], TripRequest.prototype, "people_count", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], TripRequest.prototype, "days", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], TripRequest.prototype, "budget", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], TripRequest.prototype, "experience", void 0);
__decorate([
    Column(),
    __metadata("design:type", Date)
], TripRequest.prototype, "created_at", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Object)
], TripRequest.prototype, "user_id", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Object)
], TripRequest.prototype, "itinerary_id", void 0);
TripRequest = __decorate([
    Entity('trip_requests')
], TripRequest);
export { TripRequest };
//# sourceMappingURL=TripRequest.entity.js.map