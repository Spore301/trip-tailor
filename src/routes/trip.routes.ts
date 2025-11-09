import { Router } from 'express';
import { createTripRequest, getItineraryById, getAllItineraries } from '../controllers/trip.controller';
import { validateBody } from '../middleware/validate';
import { CreateTripRequestDto } from '../dto/trip.dto';

const router = Router();

router.post('/request', validateBody(CreateTripRequestDto), createTripRequest);
router.get('/:id', getItineraryById);
router.get('/all', getAllItineraries);

export default router;

