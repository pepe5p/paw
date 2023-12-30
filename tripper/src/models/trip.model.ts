import {Timestamp} from "@angular/fire/firestore";
import {Review} from "./review.model";

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

export interface TripWithReservation extends Trip {
  reservationCount: number;
  reviews: Review[];
  stars: number;
}

export interface TripWithCumulatedReservations extends TripWithReservation {
  userReservationCount: number
}
