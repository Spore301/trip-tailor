import { Router } from 'express';
import { createTripRequest, getItineraryById, getAllItineraries } from '../controllers/trip.controller.js';
import { validateBody } from '../middleware/validate.js';
import { CreateTripRequestDto } from '../dto/trip.dto.js';
const router = Router();
router.post('/request', validateBody(CreateTripRequestDto), createTripRequest);
router.get('/:id', getItineraryById);
router.get('/all', getAllItineraries);
export default router;
//# sourceMappingURL=trip.routes.js.map