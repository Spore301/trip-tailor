import { Router } from 'express';
import { orchestratorService } from '../modules/orchestrator/orchestrator.service.js';

const router = Router();

// POST /api/orchestrator/filter
// This endpoint takes trip request parameters and returns filtered data
router.post('/filter', async (req, res) => {
	try {
		const { destination, days, people_count, budget, experience } = req.body;

		if (!destination || !days || !people_count || !budget || !experience) {
			return res.status(400).json({
				message: 'Missing required parameters: destination, days, people_count, budget, experience',
			});
		}

		const filteredData = await orchestratorService.aggregateAndFilter({
			destination,
			days,
			people_count,
			budget,
			experience,
		});

		return res.json({
			success: true,
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
	} catch (error: any) {
		console.error('Orchestrator error:', error);
		return res.status(500).json({
			message: 'Failed to aggregate and filter trip data',
			error: error.message,
		});
	}
});

export default router;

