import { IsEnum, IsInt, IsPositive, IsString, Length } from 'class-validator';
import { ExperienceType } from '../modules/trips/types.js';

export class CreateTripRequestDto {
	@IsString()
	@Length(2, 120)
	destination!: string;

	@IsInt()
	@IsPositive()
	people_count!: number;

	@IsInt()
	@IsPositive()
	days!: number;

	@IsInt()
	@IsPositive()
	budget!: number;

	@IsEnum(ExperienceType)
	experience!: ExperienceType;
}

