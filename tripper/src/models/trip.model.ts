import {Timestamp} from "@angular/fire/firestore";

export interface TripData {
  name: string;
  country: string;
  startDate: Timestamp;
  endDate: Timestamp;
  pricePLN: number;
  maxPeople: number;
  description: string;
  imageUrl: string;
}

export interface Trip extends TripData {
  id: string;
}

export interface TripWithRating extends Trip {
  rating: number;
}

export interface TripWithReservation extends Trip {
  reservationCount: number;
}

export interface TripWithCumulatedReservations extends TripWithReservation {
  userReservationCount: number
}
