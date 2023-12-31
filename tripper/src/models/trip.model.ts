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

export interface TripWithReviews extends Trip {
  reviews: Review[];
  stars: number;
}

export interface TripWithReservation extends TripWithReviews {
  reservationCount: number;
}

export interface TripWithCumulatedReservations extends TripWithReservation {
  userReservationCount: number
}

export interface TripFilter {
  name: string | null
  country: string[];
  startDate: Timestamp | null;
  endDate: Timestamp | null;
  priceFrom: number | null;
  priceTo: number | null;
  rating: number | null;
}
