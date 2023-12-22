export interface Trip {
  name: string;
  country: string;
  startDate: string;
  endDate: string;
  pricePLN: number;
  currentPeople: number;
  maxPeople: number;
  description: string;
  imageUrl: string;
  rating: number;
}

export interface TripWithId extends Trip {
  id: number;
}
