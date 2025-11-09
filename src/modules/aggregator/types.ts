export interface Activity {
	name: string;
	description: string;
	estimated_cost: number;
	location?: {
		lat: number;
		lng: number;
	};
	source?: 'skyscanner' | 'amadeus' | 'booking' | 'google' | 'tripadvisor' | 'rapidapi';
	type: 'flight' | 'hotel' | 'attraction' | 'food' | 'activity' | 'car_rental';
	duration?: string;
	rating?: number;
	image_url?: string;
}

export interface FlightData extends Activity {
	type: 'flight';
	from: string;
	to: string;
	departure_date: string;
	return_date?: string;
	airline?: string;
	duration: string;
}

export interface HotelData extends Activity {
	type: 'hotel';
	check_in: string;
	check_out: string;
	guests: number;
	rating?: number;
	amenities?: string[];
}

export interface PlaceData extends Activity {
	type: 'attraction';
	opening_hours?: string;
	address?: string;
}

export interface FoodData extends Activity {
	type: 'food';
	cuisine?: string;
	price_level?: number;
}

export interface CarRentalData extends Activity {
	type: 'car_rental';
	pick_up_location: {
		lat: number;
		lng: number;
	};
	drop_off_location: {
		lat: number;
		lng: number;
	};
	pick_up_date: string;
	drop_off_date: string;
	pick_up_time: string;
	drop_off_time: string;
	car_type?: string;
	supplier?: string;
	driver_age?: number;
}

