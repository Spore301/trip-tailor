var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsInt, IsPositive, IsString, Length } from 'class-validator';
import { ExperienceType } from '../modules/trips/types.js';
export class CreateTripRequestDto {
}
__decorate([
    IsString(),
    Length(2, 120),
    __metadata("design:type", String)
], CreateTripRequestDto.prototype, "destination", void 0);
__decorate([
    IsInt(),
    IsPositive(),
    __metadata("design:type", Number)
], CreateTripRequestDto.prototype, "people_count", void 0);
__decorate([
    IsInt(),
    IsPositive(),
    __metadata("design:type", Number)
], CreateTripRequestDto.prototype, "days", void 0);
__decorate([
    IsInt(),
    IsPositive(),
    __metadata("design:type", Number)
], CreateTripRequestDto.prototype, "budget", void 0);
__decorate([
    IsEnum(ExperienceType),
    __metadata("design:type", String)
], CreateTripRequestDto.prototype, "experience", void 0);
//# sourceMappingURL=trip.dto.js.map