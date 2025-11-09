import { Router } from 'express';
import { flightService } from '../modules/aggregator/flight.service.js';
import { hotelService } from '../modules/aggregator/hotel.service.js';
import { placesService } from '../modules/aggregator/places.service.js';
import { foodService } from '../modules/aggregator/food.service.js';
import { carRentalService } from '../modules/aggregator/car-rental.service.js';
import { activitiesService } from '../modules/aggregator/activities.service.js';

const router = Router();

// GET /api/aggregator/flights?from=DEL&to=BALI&date=2025-12-20
router.get('/flights', async (req, res) => {
	try {
		const { from, to, date, returnDate, adults } = req.query;

		if (!from || !to || !date) {
			return res.status(400).json({
				message: 'Missing required parameters: from, to, date',
			});
		}

		const flightParams: Parameters<typeof flightService.searchFlights>[0] = {
			from: String(from),
			to: String(to),
			date: String(date),
		};
		if (returnDate) flightParams.returnDate = String(returnDate);
		if (adults) flightParams.adults = Number(adults);

		const flights = await flightService.searchFlights(flightParams);

		return res.json(flights);
	} catch (error: any) {
		return res.status(500).json({
			message: 'Failed to fetch flights',
			error: error.message,
		});
	}
});

// GET /api/aggregator/hotels?location=bali&checkIn=2025-12-20&checkOut=2025-12-25&guests=2
router.get('/hotels', async (req, res) => {
	try {
		const { location, checkIn, checkOut, guests, budget } = req.query;

		if (!location || !checkIn || !checkOut || !guests) {
			return res.status(400).json({
				message: 'Missing required parameters: location, checkIn, checkOut, guests',
			});
		}

		const hotelParams: Parameters<typeof hotelService.searchHotels>[0] = {
			location: String(location),
			checkIn: String(checkIn),
			checkOut: String(checkOut),
			guests: Number(guests),
		};
		if (budget) hotelParams.budget = Number(budget);

		const hotels = await hotelService.searchHotels(hotelParams);

		return res.json(hotels);
	} catch (error: any) {
		return res.status(500).json({
			message: 'Failed to fetch hotels',
			error: error.message,
		});
	}
});

// GET /api/aggregator/places?location=bali&type=attraction
router.get('/places', async (req, res) => {
	try {
		const { location, type, budget } = req.query;

		if (!location) {
			return res.status(400).json({
				message: 'Missing required parameter: location',
			});
		}

		const placesParams: Parameters<typeof placesService.searchPlaces>[0] = {
			location: String(location),
		};
		if (type) placesParams.type = String(type);
		if (budget) placesParams.budget = Number(budget);

		const places = await placesService.searchPlaces(placesParams);

		return res.json(places);
	} catch (error: any) {
		return res.status(500).json({
			message: 'Failed to fetch places',
			error: error.message,
		});
	}
});

// GET /api/aggregator/food?location=bali
router.get('/food', async (req, res) => {
	try {
		const { location, budget } = req.query;

		if (!location) {
			return res.status(400).json({
				message: 'Missing required parameter: location',
			});
		}

		const foodParams: Parameters<typeof foodService.searchFood>[0] = {
			location: String(location),
		};
		if (budget) foodParams.budget = Number(budget);

		const food = await foodService.searchFood(foodParams);

		return res.json(food);
	} catch (error: any) {
		return res.status(500).json({
			message: 'Failed to fetch food',
			error: error.message,
		});
	}
});

// GET /api/aggregator/car-rentals?location=bali&pickUpDate=2025-12-20&dropOffDate=2025-12-25
router.get('/car-rentals', async (req, res) => {
	try {
		const { location, pickUpDate, dropOffDate, pickUpTime, dropOffTime, driverAge, budget } = req.query;

		if (!location || !pickUpDate || !dropOffDate) {
			return res.status(400).json({
				message: 'Missing required parameters: location, pickUpDate, dropOffDate',
			});
		}

		const carRentalParams: Parameters<typeof carRentalService.searchCarRentals>[0] = {
			location: String(location),
			pickUpDate: String(pickUpDate),
			dropOffDate: String(dropOffDate),
		};
		if (pickUpTime) carRentalParams.pickUpTime = String(pickUpTime);
		if (dropOffTime) carRentalParams.dropOffTime = String(dropOffTime);
		if (driverAge) carRentalParams.driverAge = Number(driverAge);
		if (budget) carRentalParams.budget = Number(budget);

		const carRentals = await carRentalService.searchCarRentals(carRentalParams);

		return res.json(carRentals);
	} catch (error: any) {
		return res.status(500).json({
			message: 'Failed to fetch car rentals',
			error: error.message,
		});
	}
});

// GET /api/aggregator/activities?location=bali
router.get('/activities', async (req, res) => {
	try {
		const { location, budget } = req.query;

		if (!location) {
			return res.status(400).json({
				message: 'Missing required parameter: location',
			});
		}

		const activitiesParams: Parameters<typeof activitiesService.searchActivities>[0] = {
			location: String(location),
		};
		if (budget) activitiesParams.budget = Number(budget);

		const activities = await activitiesService.searchActivities(activitiesParams);

		return res.json(activities);
	} catch (error: any) {
		return res.status(500).json({
			message: 'Failed to fetch activities',
			error: error.message,
		});
	}
});

export default router;

