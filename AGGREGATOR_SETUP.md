# Aggregator Service Setup

This document explains how to set up and configure the external API integrations for the Trip Tailor aggregator service.

## Overview

The aggregator service fetches data from external APIs for:
- **Flights**: Amadeus API (or mock data)
- **Hotels**: Booking.com via RapidAPI (or mock data)
- **Places/Attractions**: Google Places API (or mock data)
- **Food/Restaurants**: Google Places API (or mock data)

## Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Amadeus API (for flights)
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET=your_amadeus_api_secret

# RapidAPI (for hotels via Booking.com)
RAPIDAPI_KEY=your_rapidapi_key

# Google Places API (for attractions and restaurants)
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

## Getting API Keys

### 1. Amadeus API (Flights)

1. Go to [Amadeus for Developers](https://developers.amadeus.com/)
2. Sign up for a free account
3. Create a new app to get your API Key and API Secret
4. Use the **Test Environment** credentials for development
5. Add `AMADEUS_API_KEY` and `AMADEUS_API_SECRET` to your `.env` file

**Note**: The free tier has rate limits. The service will fall back to mock data if the API limit is exceeded.

### 2. RapidAPI (Hotels via Booking.com)

1. Go to [RapidAPI](https://rapidapi.com/)
2. Sign up for a free account
3. Subscribe to the "Booking.com" API
4. Get your API key from the dashboard
5. Add `RAPIDAPI_KEY` to your `.env` file

**Alternative**: You can use other hotel APIs available on RapidAPI if Booking.com is not available.

### 3. Google Places API (Attractions & Food)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API** and **Places API (New)**
4. Create credentials (API Key)
5. Restrict the API key to only the Places API for security
6. Add `GOOGLE_PLACES_API_KEY` to your `.env` file

**Note**: Google Places API has a free tier with $200 credit per month. After that, you'll be charged per request.

## Testing the Aggregator

Once you've set up your API keys, you can test the aggregator endpoints:

### Flights
```bash
GET /api/aggregator/flights?from=DEL&to=BOM&date=2025-12-20&adults=2
```

### Hotels
```bash
GET /api/aggregator/hotels?location=bali&checkIn=2025-12-20&checkOut=2025-12-25&guests=2
```

### Places/Attractions
```bash
GET /api/aggregator/places?location=bali
```

### Food/Restaurants
```bash
GET /api/aggregator/food?location=bali
```

## Fallback to Mock Data

If API keys are not configured or API calls fail, the service will automatically fall back to mock data. This ensures the application continues to work during development and testing.

## Caching

The aggregator service uses in-memory caching (via `node-cache`) to:
- Reduce API calls
- Improve response times
- Stay within API rate limits

Cache TTL:
- Real API data: 1 hour (3600 seconds)
- Mock data: 5 minutes (300 seconds)

## Cost Estimation

The `estimation.service.ts` provides cost calculation and budget filtering:
- Calculates total cost across all activities
- Breaks down costs by category (flights, hotels, attractions, food, activities)
- Filters activities to fit within budget constraints

## Next Steps

After setting up the aggregator:
1. Test each endpoint with real API keys
2. Verify the data normalization is working correctly
3. Integrate with the LLM service (Developer 3's task) to generate itineraries
4. Consider adding Redis for distributed caching in production

