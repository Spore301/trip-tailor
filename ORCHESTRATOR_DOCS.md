# Orchestrator Service Documentation

## Overview

The orchestrator service is responsible for aggregating data from all external APIs and filtering it based on:
1. **Budget constraints** - Ensures total cost doesn't exceed user's budget
2. **Experience type** - Filters and prioritizes activities based on adventure/offbeat/staycation

## Budget Allocation by Experience Type

### Adventure
- **Flights**: 25% of budget
- **Hotels**: 15% of budget (budget-friendly options)
- **Car Rentals**: 15% of budget (SUVs for adventure flexibility)
- **Activities**: 30% of budget (adventure sports, outdoor activities)
- **Food**: 15% of budget (quick meals, local street food)

**Filtering Logic**:
- Prioritizes cheaper flights to save budget for activities
- Prefers budget-friendly hotels
- Prioritizes SUVs for car rentals (adventure-friendly)
- Prioritizes paid adventure activities over free attractions
- Focuses on quick, affordable meals

### Offbeat
- **Flights**: 20% of budget
- **Hotels**: 25% of budget (unique stays)
- **Car Rentals**: 15% of budget (reliable vehicles for exploring)
- **Activities**: 25% of budget (unique, hidden gems)
- **Food**: 15% of budget (local cuisine, unique dining)

**Filtering Logic**:
- Balanced approach
- Prioritizes unique, highly-rated places
- Mix of free and paid unique experiences
- Reliable vehicles for offbeat exploration
- Focuses on local cuisine and unique dining

### Staycation
- **Flights**: 15% of budget (if needed)
- **Hotels**: 45% of budget (luxury stays)
- **Car Rentals**: 10% of budget (luxury/comfort vehicles)
- **Activities**: 15% of budget (relaxing activities)
- **Food**: 15% of budget (fine dining, relaxed meals)

**Filtering Logic**:
- Prioritizes luxury/high-rated hotels
- Focuses on relaxing, scenic places
- Prefers luxury/comfort vehicles for car rentals
- Prefers free/low-cost scenic attractions
- Emphasizes fine dining and relaxed meals

## API Endpoint

### POST /api/orchestrator/filter

Aggregates and filters trip data based on user input.

**Request Body**:
```json
{
  "destination": "bali",
  "days": 5,
  "people_count": 2,
  "budget": 80000,
  "experience": "adventure"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "flights": [...],
    "hotels": [...],
    "car_rentals": [...],
    "places": [...],
    "food": [...],
    "totalEstimatedCost": 75000,
    "budgetRemaining": 5000,
    "budgetAllocation": {
      "flights": 24000,
      "hotels": 16000,
      "car_rentals": 12000,
      "activities": 28000,
      "food": 12000
    }
  },
  "summary": {
    "totalActivities": 35,
    "totalCost": 75000,
    "budgetRemaining": 5000,
    "budgetUtilization": "93.75%"
  }
}
```

## How It Works

1. **Budget Allocation**: Calculates budget limits for each category based on experience type
2. **Parallel Data Fetching**: Fetches data from all services (flights, hotels, car rentals, activities, places, food) simultaneously
3. **Experience-Based Filtering**: Applies experience-specific filtering logic to each category
4. **Budget Validation**: Checks if total cost exceeds budget
5. **Additional Filtering**: If over budget, applies additional budget filtering using estimation service
6. **Result Compilation**: Returns filtered data with cost breakdown

## Integration with Trip Request

The filtered data from the orchestrator service is automatically used when a trip request is created:

1. User submits trip request via `POST /api/trip/request`
2. Orchestrator fetches and filters data from all APIs
3. Filtered data is saved as the itinerary
4. Itinerary data is returned immediately to the user

**No LLM processing** - The system uses only API data with intelligent filtering based on budget and experience type.

## Example Usage

### Direct API Call

```typescript
import { orchestratorService } from './modules/orchestrator/orchestrator.service';

const filteredData = await orchestratorService.aggregateAndFilter({
  destination: 'bali',
  days: 5,
  people_count: 2,
  budget: 80000,
  experience: 'adventure',
});

// Access filtered data
console.log(filteredData.flights);      // Filtered flights
console.log(filteredData.hotels);       // Filtered hotels
console.log(filteredData.car_rentals);  // Filtered car rentals
console.log(filteredData.places);       // Filtered attractions/activities
console.log(filteredData.food);         // Filtered restaurants
```

### Via Trip Request Endpoint

When a user submits a trip request via `POST /api/trip/request`, the orchestrator automatically:
1. Fetches data from all APIs
2. Filters by budget and experience type
3. Saves the filtered data as the itinerary
4. Returns the complete itinerary immediately

## Future Improvements

1. **Airport Code Lookup**: Currently uses a simplified approach for flight searches. Should integrate with airport code lookup service.
2. **Dynamic Date Calculation**: Currently uses fixed dates. Should allow user to specify travel dates.
3. **Multi-City Support**: Currently supports single destination. Can be extended for multi-city trips.
4. **Real-time Availability**: Can integrate real-time availability checks for flights and hotels.
5. **User Preferences**: Can add additional filtering based on user preferences (dietary restrictions, accessibility, etc.)

## Testing

Test the orchestrator endpoint:

```bash
curl -X POST http://localhost:3000/api/orchestrator/filter \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "bali",
    "days": 5,
    "people_count": 2,
    "budget": 80000,
    "experience": "adventure"
  }'
```

