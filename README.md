# Trip Tailor AI - Frontend

React + TypeScript + Vite frontend for Trip Tailor AI trip planning application.

## Features

- **Plan Your Trip Form**: Beautiful form with all trip planning fields
  - Destination input
  - Number of travelers
  - Number of days
  - Budget (₹)
  - Experience type (Adventure, Offbeat, Staycation)
- **Modern UI**: Tailwind CSS styling with gradient headers and travel-themed background
- **API Integration**: Connected to backend REST API
- **Form Validation**: Client-side validation with error handling
- **Responsive Design**: Works on desktop and mobile devices

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional, defaults to `http://localhost:3000/api`):
```
VITE_API_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Icons** - Icon library
- **Axios** - HTTP client for API calls

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── TripForm.tsx      # Main trip planning form
│   ├── services/
│   │   └── api.ts            # API service layer
│   ├── types/
│   │   └── trip.ts           # TypeScript types and interfaces
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── index.html
└── package.json
```

## API Integration

The frontend communicates with the backend API at the following endpoints:

- `POST /api/trip/request` - Create a new trip request
- `GET /api/trip/:id` - Get itinerary by ID
- `GET /api/trip/all` - Get all itineraries

## Development

Make sure the backend server is running on `http://localhost:3000` before starting the frontend, or update the `VITE_API_URL` environment variable to point to your backend.
