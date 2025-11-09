import { ExperienceType } from '../trips/types.js';
import { flightService } from '../aggregator/flight.service.js';
import { hotelService } from '../aggregator/hotel.service.js';
import { placesService } from '../aggregator/places.service.js';
import { foodService } from '../aggregator/food.service.js';
import { carRentalService } from '../aggregator/car-rental.service.js';
import { activitiesService } from '../aggregator/activities.service.js';
import { estimationService } from '../aggregator/estimation.service.js';
class OrchestratorService {
    /**
     * Get budget allocation based on experience type
     */
    getBudgetAllocation(experience) {
        switch (experience) {
            case 'adventure':
                // Adventure: More budget for activities and car rentals, less for hotels
                return {
                    flights: 25, // 25% for flights
                    hotels: 15, // 15% for hotels (budget-friendly)
                    car_rentals: 15, // 15% for car rentals (flexibility for adventure)
                    activities: 30, // 30% for activities (adventure sports, outdoor)
                    food: 15, // 15% for food
                };
            case 'offbeat':
                // Offbeat: Balanced, focus on unique experiences
                return {
                    flights: 20, // 20% for flights
                    hotels: 25, // 25% for hotels (unique stays)
                    car_rentals: 15, // 15% for car rentals (explore offbeat places)
                    activities: 25, // 25% for unique places/experiences
                    food: 15, // 15% for local food
                };
            case 'staycation':
                // Staycation: More budget for hotels, less for activities and car rentals
                return {
                    flights: 15, // 15% for flights (if needed)
                    hotels: 45, // 45% for hotels (luxury stays)
                    car_rentals: 10, // 10% for car rentals (optional)
                    activities: 15, // 15% for relaxing activities
                    food: 15, // 15% for food
                };
            default:
                // Default: Balanced allocation
                return {
                    flights: 25,
                    hotels: 25,
                    car_rentals: 15,
                    activities: 20,
                    food: 15,
                };
        }
    }
    /**
     * Filter flights by budget and prioritize by experience type
     */
    filterFlights(flights, budgetLimit, experience) {
        // Filter by budget
        const withinBudget = flights.filter((flight) => flight.estimated_cost <= budgetLimit);
        // Sort by experience type preferences
        if (experience === 'adventure' || experience === 'offbeat') {
            // Prefer cheaper flights to save budget for activities
            return withinBudget.sort((a, b) => a.estimated_cost - b.estimated_cost).slice(0, 3);
        }
        else {
            // Staycation: Can prioritize comfort
            return withinBudget.slice(0, 3);
        }
    }
    /**
     * Filter hotels by budget and experience type
     */
    filterHotels(hotels, budgetLimit, experience, days) {
        // Calculate per-night budget
        const perNightBudget = budgetLimit / days;
        // Filter by budget
        let filtered = hotels.filter((hotel) => hotel.estimated_cost <= budgetLimit);
        // Sort and filter by experience type
        if (experience === 'adventure') {
            // Adventure: Prefer budget-friendly options
            filtered = filtered
                .sort((a, b) => a.estimated_cost - b.estimated_cost)
                .slice(0, 5);
        }
        else if (experience === 'offbeat') {
            // Offbeat: Prefer unique/highly-rated options
            filtered = filtered
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 5);
        }
        else {
            // Staycation: Prefer luxury/high-rated options
            filtered = filtered
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 5);
        }
        return filtered;
    }
    /**
     * Filter places by budget and experience type
     */
    filterPlaces(places, budgetLimit, experience, peopleCount) {
        // Filter by budget (cost is per person for activities)
        const totalBudget = budgetLimit * peopleCount;
        let filtered = places.filter((place) => place.estimated_cost * peopleCount <= totalBudget);
        // Sort and filter by experience type
        if (experience === 'adventure') {
            // Adventure: Prefer activities with higher costs (adventure sports)
            // Look for keywords or prioritize paid activities
            filtered = filtered
                .sort((a, b) => {
                // Prioritize activities with costs (adventure activities)
                if (a.estimated_cost > 0 && b.estimated_cost === 0)
                    return -1;
                if (a.estimated_cost === 0 && b.estimated_cost > 0)
                    return 1;
                // Then by rating
                return (b.rating || 0) - (a.rating || 0);
            })
                .slice(0, 10);
        }
        else if (experience === 'offbeat') {
            // Offbeat: Prefer unique, less popular places (lower cost might indicate hidden gems)
            filtered = filtered
                .sort((a, b) => {
                // Mix of free and paid unique experiences
                const uniquenessScore = (place) => {
                    // Prefer places with good ratings but moderate cost (not too touristy)
                    return (place.rating || 0) * (place.estimated_cost === 0 ? 1.2 : 1);
                };
                return uniquenessScore(b) - uniquenessScore(a);
            })
                .slice(0, 10);
        }
        else {
            // Staycation: Prefer relaxing, scenic places
            filtered = filtered
                .sort((a, b) => {
                // Prioritize free/low-cost scenic places
                if (a.estimated_cost === 0 && b.estimated_cost > 0)
                    return -1;
                if (a.estimated_cost > 0 && b.estimated_cost === 0)
                    return 1;
                return (b.rating || 0) - (a.rating || 0);
            })
                .slice(0, 8);
        }
        return filtered;
    }
    /**
     * Filter food by budget and experience type
     */
    filterFood(food, budgetLimit, experience, peopleCount, days) {
        // Calculate per meal budget (3 meals per day)
        const mealsPerDay = 3;
        const totalMeals = days * mealsPerDay;
        const perMealBudget = (budgetLimit * peopleCount) / totalMeals;
        // Filter by budget
        let filtered = food.filter((restaurant) => restaurant.estimated_cost <= perMealBudget);
        // Sort and filter by experience type
        if (experience === 'adventure') {
            // Adventure: Mix of local street food and cafes (quick meals)
            filtered = filtered
                .sort((a, b) => {
                // Prefer lower price levels for quick meals
                const priceWeight = (f) => f.price_level || 2;
                return priceWeight(a) - priceWeight(b);
            })
                .slice(0, 15);
        }
        else if (experience === 'offbeat') {
            // Offbeat: Local cuisine, unique dining experiences
            filtered = filtered
                .sort((a, b) => {
                // Prefer local cuisine, good ratings
                const score = (f) => (f.rating || 0) + (f.cuisine?.toLowerCase().includes('local') ? 1 : 0);
                return score(b) - score(a);
            })
                .slice(0, 15);
        }
        else {
            // Staycation: Fine dining and relaxed meals
            filtered = filtered
                .sort((a, b) => {
                // Prefer higher-rated restaurants
                return (b.rating || 0) - (a.rating || 0);
            })
                .slice(0, 12);
        }
        return filtered;
    }
    /**
     * Filter car rentals by budget and experience type
     */
    filterCarRentals(carRentals, budgetLimit, experience) {
        // Filter by budget
        let filtered = carRentals.filter((rental) => rental.estimated_cost <= budgetLimit);
        // Sort and filter by experience type
        if (experience === 'adventure') {
            // Adventure: Prefer SUVs or vehicles suitable for adventure
            filtered = filtered
                .sort((a, b) => {
                // Prefer SUVs, then by price
                const suvPriority = (r) => (r.car_type?.toLowerCase().includes('suv') ? 0 : 1);
                if (suvPriority(a) !== suvPriority(b)) {
                    return suvPriority(a) - suvPriority(b);
                }
                return a.estimated_cost - b.estimated_cost;
            })
                .slice(0, 5);
        }
        else if (experience === 'offbeat') {
            // Offbeat: Balanced, reliable vehicles
            filtered = filtered
                .sort((a, b) => {
                // Prefer good ratings and moderate prices
                return (b.rating || 0) - (a.rating || 0);
            })
                .slice(0, 5);
        }
        else {
            // Staycation: Comfort and luxury
            filtered = filtered
                .sort((a, b) => {
                // Prefer luxury/comfort, then by rating
                const luxuryPriority = (r) => r.car_type?.toLowerCase().includes('luxury') || r.car_type?.toLowerCase().includes('sedan') ? 0 : 1;
                if (luxuryPriority(a) !== luxuryPriority(b)) {
                    return luxuryPriority(a) - luxuryPriority(b);
                }
                return (b.rating || 0) - (a.rating || 0);
            })
                .slice(0, 5);
        }
        return filtered;
    }
    /**
     * Main orchestration method - aggregates and filters all data
     */
    async aggregateAndFilter(params) {
        const { destination, days, people_count, budget, experience } = params;
        // Get budget allocation based on experience type
        const allocation = this.getBudgetAllocation(experience);
        const budgetLimits = {
            flights: (budget * allocation.flights) / 100,
            hotels: (budget * allocation.hotels) / 100,
            car_rentals: (budget * allocation.car_rentals) / 100,
            activities: (budget * allocation.activities) / 100,
            food: (budget * allocation.food) / 100,
        };
        // Calculate dates (simplified - using current date + days)
        const today = new Date();
        const checkIn = new Date(today);
        checkIn.setDate(today.getDate() + 7); // 7 days from now
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkIn.getDate() + days);
        const dateString = checkIn.toISOString().split('T')[0];
        const checkInString = checkIn.toISOString().split('T')[0];
        const checkOutString = checkOut.toISOString().split('T')[0];
        // Fetch data from all services in parallel
        const [flights, hotels, carRentals, places, activities, food] = await Promise.all([
            // Flights - using destination as "to", need to determine "from" (could be user input or default)
            flightService
                .searchFlights({
                from: 'DEL', // Default to Delhi, should be configurable
                to: destination.toUpperCase().slice(0, 3), // Simplified airport code
                date: dateString,
                adults: people_count,
            })
                .catch(() => []),
            // Hotels
            hotelService
                .searchHotels({
                location: destination,
                checkIn: checkInString,
                checkOut: checkOutString,
                guests: people_count,
                budget: budgetLimits.hotels,
            })
                .catch(() => []),
            // Car Rentals
            carRentalService
                .searchCarRentals({
                location: destination,
                pickUpDate: checkInString,
                dropOffDate: checkOutString,
                driverAge: 30,
                budget: budgetLimits.car_rentals,
            })
                .catch(() => []),
            // Places/Attractions (Google Places - as fallback)
            placesService
                .searchPlaces({
                location: destination,
                budget: budgetLimits.activities,
            })
                .catch(() => []),
            // Activities (Booking.com)
            activitiesService
                .searchActivities({
                location: destination,
                budget: budgetLimits.activities,
            })
                .catch(() => []),
            // Food
            foodService
                .searchFood({
                location: destination,
                budget: budgetLimits.food,
            })
                .catch(() => []),
        ]);
        // Filter each category based on budget and experience type
        const filteredFlights = this.filterFlights(flights, budgetLimits.flights, experience);
        const filteredHotels = this.filterHotels(hotels, budgetLimits.hotels, experience, days);
        const filteredCarRentals = this.filterCarRentals(carRentals, budgetLimits.car_rentals, experience);
        // Combine places and activities, then filter
        const allPlacesAndActivities = [...places, ...activities];
        const filteredPlaces = this.filterPlaces(allPlacesAndActivities, budgetLimits.activities, experience, people_count);
        const filteredFood = this.filterFood(food, budgetLimits.food, experience, people_count, days);
        // Combine all activities for cost estimation
        const allActivities = [
            ...filteredFlights,
            ...filteredHotels,
            ...filteredCarRentals,
            ...filteredPlaces,
            ...filteredFood,
        ];
        // Calculate total cost
        const costEstimate = estimationService.calculateTotalCost(allActivities, people_count, days);
        const totalCost = costEstimate.total;
        const budgetRemaining = budget - totalCost;
        // If over budget, apply additional filtering
        if (totalCost > budget) {
            // Use estimation service to filter by budget
            const budgetFiltered = estimationService.filterByBudget(allActivities, budget, people_count, days);
            // Re-categorize filtered results
            const finalFlights = budgetFiltered.filter((a) => a.type === 'flight');
            const finalHotels = budgetFiltered.filter((a) => a.type === 'hotel');
            const finalCarRentals = budgetFiltered.filter((a) => a.type === 'car_rental');
            const finalPlaces = budgetFiltered.filter((a) => a.type === 'attraction');
            const finalFood = budgetFiltered.filter((a) => a.type === 'food');
            // Recalculate cost
            const finalCost = estimationService.calculateTotalCost(budgetFiltered, people_count, days);
            return {
                flights: finalFlights,
                hotels: finalHotels,
                car_rentals: finalCarRentals,
                places: finalPlaces,
                food: finalFood,
                totalEstimatedCost: finalCost.total,
                budgetRemaining: budget - finalCost.total,
                budgetAllocation: {
                    flights: finalCost.breakdown.flights || 0,
                    hotels: finalCost.breakdown.hotels || 0,
                    car_rentals: finalCost.breakdown.car_rentals || 0,
                    activities: finalCost.breakdown.attractions || 0,
                    food: finalCost.breakdown.food || 0,
                },
            };
        }
        return {
            flights: filteredFlights,
            hotels: filteredHotels,
            car_rentals: filteredCarRentals,
            places: filteredPlaces,
            food: filteredFood,
            totalEstimatedCost: totalCost,
            budgetRemaining,
            budgetAllocation: {
                flights: costEstimate.breakdown.flights || 0,
                hotels: costEstimate.breakdown.hotels || 0,
                car_rentals: costEstimate.breakdown.car_rentals || 0,
                activities: costEstimate.breakdown.attractions || 0,
                food: costEstimate.breakdown.food || 0,
            },
        };
    }
}
export const orchestratorService = new OrchestratorService();
//# sourceMappingURL=orchestrator.service.js.map