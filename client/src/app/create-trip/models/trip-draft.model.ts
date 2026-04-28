export interface TripDraft {
  startDate: string | null;
  endDate: string | null;
  budgetTier: number;
  tags: string[];
  members: number;
  hasElderlyOrKids: boolean;
  isVegeterian: boolean;
  accommodations: string[];
  mustGoPlaces: string[];
  pace?: string;
}
