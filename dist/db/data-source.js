import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../modules/users/User.entity.js';
import { TripRequest } from '../modules/trips/TripRequest.entity.js';
import { Itinerary } from '../modules/trips/Itinerary.entity.js';
export const AppDataSource = new DataSource({
    type: 'mongodb',
    url: process.env.MONGO_URI ? `${process.env.MONGO_URI}&authSource=admin&replicaSet=atlas-2tfjz7-shard-0&ssl=true` : 'mongodb://localhost:27017/triptailor',
    synchronize: true,
    logging: ['query', 'error'],
    entities: [User, TripRequest, Itinerary],
    extra: {
        tlsAllowInvalidCertificates: true,
        debug: true,
    },
});
//# sourceMappingURL=data-source.js.map