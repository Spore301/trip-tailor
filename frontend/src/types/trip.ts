export const ExperienceTypeValues = {
  ADVENTURE: 'adventure',
  OFFBEAT: 'offbeat',
  STAYCATION: 'staycation',
} as const;

export type ExperienceType = typeof ExperienceTypeValues[keyof typeof ExperienceTypeValues];

export interface TripRequest {
  destination: string;
  people_count: number;
  days: number;
  budget: number;
  experience: ExperienceType;
}

export interface TripRequestResponse {
  id: string;
  status: string;
}

