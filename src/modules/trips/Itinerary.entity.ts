import { Entity, Column } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ObjectIdColumn } from 'typeorm';

@Entity('itineraries')
export class Itinerary {
	@ObjectIdColumn()
	_id!: ObjectId;

	@Column()
	trip_request_id!: ObjectId;

	@Column()
	summary_json!: unknown;

	@Column()
	total_estimate!: number;
}



