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
let Itinerary = class Itinerary {
};
__decorate([
    ObjectIdColumn(),
    __metadata("design:type", ObjectId)
], Itinerary.prototype, "_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", ObjectId)
], Itinerary.prototype, "trip_request_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", Object)
], Itinerary.prototype, "summary_json", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Itinerary.prototype, "total_estimate", void 0);
Itinerary = __decorate([
    Entity('itineraries')
], Itinerary);
export { Itinerary };
//# sourceMappingURL=Itinerary.entity.js.map