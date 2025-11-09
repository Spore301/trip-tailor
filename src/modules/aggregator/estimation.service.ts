import type { Activity } from './types.js';

export interface CostEstimate {
	total: number;
	breakdown: {
		flights?: number;
		hotels?: number;
		attractions?: number;
		food?: number;
		activities?: number;
		car_rentals?: number;
	};
	perPerson?: number;
	perDay?: number;
}

export class EstimationService {
	calculateTotalCost(activities: Activity[], peopleCount: number, days: number): CostEstimate {
		const breakdown = {
			flights: 0,
			hotels: 0,
			attractions: 0,
			food: 0,
			activities: 0,
			car_rentals: 0,
		};

		activities.forEach((activity) => {
			switch (activity.type) {
				case 'flight':
					breakdown.flights += activity.estimated_cost;
					break;
				case 'hotel':
					breakdown.hotels += activity.estimated_cost;
					break;
				case 'attraction':
					breakdown.attractions += activity.estimated_cost * peopleCount;
					break;
				case 'food':
					// Food cost is typically per person per meal
					breakdown.food += activity.estimated_cost * peopleCount;
					break;
				case 'activity':
					breakdown.activities += activity.estimated_cost * peopleCount;
					break;
				case 'car_rental':
					// Car rental is per rental, not per person
					breakdown.car_rentals += activity.estimated_cost;
					break;
			}
		});

		const total = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0);
		const perPerson = total / peopleCount;
		const perDay = total / days;

		return {
			total,
			breakdown,
			perPerson,
			perDay,
		};
	}

	filterByBudget(activities: Activity[], budget: number, peopleCount: number, days: number): Activity[] {
		const estimate = this.calculateTotalCost(activities, peopleCount, days);

		if (estimate.total <= budget) {
			return activities;
		}

		// If over budget, prioritize and filter
		// Priority: flights > hotels > car_rentals > attractions > food > activities
		const sorted = activities.sort((a, b) => {
			const priority: Record<string, number> = {
				flight: 1,
				hotel: 2,
				car_rental: 3,
				attraction: 4,
				food: 5,
				activity: 6,
			};
			return (priority[a.type] || 99) - (priority[b.type] || 99);
		});

		const filtered: Activity[] = [];
		let currentTotal = 0;

		for (const activity of sorted) {
			const activityCost =
				activity.type === 'attraction' || activity.type === 'food' || activity.type === 'activity'
					? activity.estimated_cost * peopleCount
					: activity.estimated_cost;

			if (currentTotal + activityCost <= budget) {
				filtered.push(activity);
				currentTotal += activityCost;
			}
		}

		return filtered;
	}
}

export const estimationService = new EstimationService();

