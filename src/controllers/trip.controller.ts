import type { Request, Response } from 'express';
import { AppDataSource } from '../db/data-source.js';
import { TripRequest } from '../modules/trips/TripRequest.entity.js';
import { Itinerary } from '../modules/trips/Itinerary.entity.js';
import { ExperienceType } from '../modules/trips/types.js';
import { ObjectId } from 'mongodb';
import { orchestratorService } from '../modules/orchestrator/orchestrator.service.js';

export async function createTripRequest(req: Request, res: Response) {
	try {
		const { destination, people_count, days, budget, experience } = req.body as {
			destination: string;
			people_count: number;
			days: number;
			budget: number;
			experience: ExperienceType;
		};

		// Save trip request
		const tripRepo = AppDataSource.getRepository(TripRequest);
		const tr = tripRepo.create({ destination, people_count, days, budget, experience, created_at: new Date() });
		await tripRepo.save(tr);
		const tripRequestId = (tr as any)._id?.toString?.() ?? (tr as any).id;

		// Get filtered data from orchestrator (APIs only, no LLM)
		const filteredData = await orchestratorService.aggregateAndFilter({
			destination,
			days,
			people_count,
			budget,
			experience,
		});

		// Calculate total estimate
		const totalEstimate = filteredData.totalEstimatedCost;

		// Save itinerary with filtered API data
		const itineraryRepo = AppDataSource.getRepository(Itinerary);
		const itinerary = itineraryRepo.create({
			trip_request_id: new ObjectId(tripRequestId),
			summary_json: filteredData,
			total_estimate: totalEstimate,
		});
		await itineraryRepo.save(itinerary);

		const itineraryId = (itinerary as any)._id?.toString?.() ?? (itinerary as any).id;

		// Return itinerary data immediately
		return res.status(200).json({
			id: itineraryId,
			trip_request_id: tripRequestId,
			status: 'completed',
			data: filteredData,
			summary: {
				totalActivities:
					filteredData.flights.length +
					filteredData.hotels.length +
					filteredData.car_rentals.length +
					filteredData.places.length +
					filteredData.food.length,
				totalCost: filteredData.totalEstimatedCost,
				budgetRemaining: filteredData.budgetRemaining,
				budgetUtilization: ((filteredData.totalEstimatedCost / budget) * 100).toFixed(2) + '%',
			},
		});
	} catch (err: any) {
		console.error('Error creating trip request:', err);
		return res.status(500).json({ message: 'Failed to create request', error: err.message });
	}
}

export async function getItineraryById(req: Request, res: Response) {
	try {
		const { id } = req.params as { id: string };
		const repo = AppDataSource.getRepository(Itinerary);
		const itinerary = await repo.findOne({ where: { _id: new ObjectId(id) } });
		if (!itinerary) return res.status(404).json({ message: 'Not found' });
		return res.json(itinerary);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch itinerary' });
	}
}

export async function getAllItineraries(_req: Request, res: Response) {
	try {
		const repo = AppDataSource.getRepository(Itinerary);
		const list = await repo.find();
		return res.json(list);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch itineraries' });
	}
}

