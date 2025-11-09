# Quick Start Guide

## Running the Frontend Only (View the UI)

You can run just the frontend to see the form, even without the backend:

```bash
cd frontend
npm run dev
```

Then open your browser to `http://localhost:5173` (or whatever port Vite shows).

**Note**: The form will show an error when you try to submit (since the backend isn't running), but you can see and interact with the UI.

## Running Both Frontend and Backend

### Option 1: Run in Separate Terminals

**Terminal 1 - Backend:**
```bash
cd /Users/spurge/TripTailor
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /Users/spurge/TripTailor/frontend
npm run dev
```

### Option 2: Run Backend in Background

**Terminal 1 - Backend (background):**
```bash
cd /Users/spurge/TripTailor
npm run dev &
```

**Terminal 2 - Frontend:**
```bash
cd /Users/spurge/TripTailor/frontend
npm run dev
```

## Prerequisites

### For Frontend Only:
- ✅ Nothing needed! Just run `npm run dev` in the frontend folder

### For Backend:
- MongoDB running (or set `MONGO_URI` in `.env`)
- Environment variables in `.env` file (optional for basic functionality)

## Environment Setup

Create a `.env` file in the root directory:

```bash
# MongoDB
MONGO_URI=mongodb://localhost:27017/triptailor

# Server
PORT=3000

# API Keys (optional - will use mock data if not set)
# AMADEUS_API_KEY=your_key
# AMADEUS_API_SECRET=your_secret
# RAPIDAPI_KEY=your_key
# GOOGLE_PLACES_API_KEY=your_key
```

## Testing

1. **Frontend**: Open `http://localhost:5173`
2. **Backend API**: Open `http://localhost:3000/api/trip/request`
3. **API Docs**: Open `http://localhost:3000/docs` (Swagger UI)

## Troubleshooting

### Frontend won't start
- Make sure you're in the `frontend/` directory
- Run `npm install` in the frontend directory

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists with `MONGO_URI`
- Check if port 3000 is available

### Form submission fails
- Make sure backend is running on port 3000
- Check browser console for errors
- Verify CORS is enabled in backend (it should be)

