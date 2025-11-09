import { Entity, Column } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ObjectIdColumn } from 'typeorm';
import { ExperienceType } from './types.js';

@Entity('trip_requests')
export class TripRequest {
	@ObjectIdColumn()
	_id!: ObjectId;

	@Column()
	destination!: string;

	@Column()
	people_count!: number;

	@Column()
	days!: number;

	@Column()
	budget!: number;

	@Column()
	experience!: ExperienceType;

	@Column()
	created_at!: Date;

	@Column({ nullable: true })
	user_id?: ObjectId | null;

	@Column({ nullable: true })
	itinerary_id?: ObjectId | null;
}

