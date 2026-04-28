export interface TripActivity {
  placeId: string;
  placeName: string;
  activityType: 'meal' | 'attraction' | 'hotel' | 'transport';
  startTime: string;
  endTime: string;
  durationMinutes: number;
  notes: string;
}

export interface TripDay {
  dayIndex: number;
  date: string;
  dayTheme: string;
  activities: TripActivity[];
}

export interface TripData {
  title?: string; // Bổ sung thuộc tính title có thể undefined
  reasoning: string;
  tripSummary: string;
  days: TripDay[];
}
