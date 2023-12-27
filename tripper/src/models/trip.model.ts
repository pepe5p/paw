export interface TripData {
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

export interface Trip extends TripData {
  id: string;
}
