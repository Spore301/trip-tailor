# Trip Tailor API Flow (No LLM)

## Overview

Trip Tailor uses **only external APIs** to fetch, filter, and return trip data. No LLM processing is involved. The system intelligently filters API responses based on budget and experience type.

## Complete Flow

### 1. User Submits Trip Request

**Endpoint**: `POST /api/trip/request`

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

### 2. Orchestrator Fetches Data from APIs

The orchestrator service automatically fetches data from all configured APIs in parallel:

- **Flights**: Amadeus API (or mock data)
- **Hotels**: Booking.com RapidAPI
- **Car Rentals**: Booking.com RapidAPI
- **Activities**: Booking.com RapidAPI + Google Places (fallback)
- **Food**: Google Places API

### 3. Budget Allocation by Experience Type

Based on the experience type, the budget is allocated:

**Adventure**:
- Flights: 25%
- Hotels: 15%
- Car Rentals: 15%
- Activities: 30%
- Food: 15%

**Offbeat**:
- Flights: 20%
- Hotels: 25%
- Car Rentals: 15%
- Activities: 25%
- Food: 15%

**Staycation**:
- Flights: 15%
- Hotels: 45%
- Car Rentals: 10%
- Activities: 15%
- Food: 15%

### 4. Experience-Based Filtering

Each category is filtered based on the experience type:

- **Adventure**: Prioritizes adventure activities, SUVs for car rentals, budget hotels
- **Offbeat**: Focuses on unique places, reliable vehicles, local cuisine
- **Staycation**: Emphasizes luxury hotels, comfort vehicles, fine dining

### 5. Budget Validation & Filtering

- Calculates total cost across all categories
- If over budget, applies additional filtering
- Ensures total cost doesn't exceed user's budget

### 6. Save & Return Results

- Saves trip request to database
- Saves filtered data as itinerary
- Returns complete itinerary immediately

**Response**:
```json
{
  "id": "itinerary_id",
  "trip_request_id": "trip_request_id",
  "status": "completed",
  "data": {
    "flights": [...],
    "hotels": [...],
    "car_rentals": [...],
    "places": [...],
    "food": [...],
    "totalEstimatedCost": 75000,
    "budgetRemaining": 5000,
    "budgetAllocation": {...}
  },
  "summary": {
    "totalActivities": 35,
    "totalCost": 75000,
    "budgetRemaining": 5000,
    "budgetUtilization": "93.75%"
  }
}
```

## API Endpoints

### Trip Request
- `POST /api/trip/request` - Create trip request and get itinerary
- `GET /api/trip/:id` - Get itinerary by ID
- `GET /api/trip/all` - Get all itineraries

### Aggregator (Direct API Access)
- `GET /api/aggregator/flights` - Get flights
- `GET /api/aggregator/hotels` - Get hotels
- `GET /api/aggregator/car-rentals` - Get car rentals
- `GET /api/aggregator/activities` - Get activities
- `GET /api/aggregator/places` - Get places/attractions
- `GET /api/aggregator/food` - Get restaurants

### Orchestrator
- `POST /api/orchestrator/filter` - Get filtered data based on trip parameters

## Key Features

✅ **No LLM Required** - Uses only API data with intelligent filtering
✅ **Budget-Aware** - Ensures all results fit within user's budget
✅ **Experience-Based** - Filters and prioritizes based on adventure/offbeat/staycation
✅ **Real-Time** - Returns results immediately (no async processing)
✅ **Multiple APIs** - Aggregates data from flights, hotels, car rentals, activities, and food
✅ **Caching** - Caches API responses for faster repeated queries
✅ **Fallback** - Uses mock data if APIs are unavailable

## Environment Variables

```bash
# MongoDB
MONGO_URI=mongodb+srv://...

# API Keys
RAPIDAPI_KEY=your_rapidapi_key
AMADEUS_API_KEY=your_amadeus_key
AMADEUS_API_SECRET=your_amadeus_secret
GOOGLE_PLACES_API_KEY=your_google_places_key
```

## Testing

```bash
# Create trip request
curl -X POST http://localhost:3000/api/trip/request \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "bali",
    "days": 5,
    "people_count": 2,
    "budget": 80000,
    "experience": "adventure"
  }'
```

The response will include all filtered data from the APIs, ready to display to the user.

