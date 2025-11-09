import { Entity, Column } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ObjectIdColumn } from 'typeorm';

@Entity('users')
export class User {
	@ObjectIdColumn()
	_id!: ObjectId;

	@Column({ type: 'varchar', length: 100 })
	name!: string;

	@Column({ type: 'varchar', length: 150, unique: true })
	email!: string;

	@Column({ type: 'varchar', length: 255 })
	password_hash!: string;

  // For MongoDB we store references by IDs in documents that need them
}



