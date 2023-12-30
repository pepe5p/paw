import {Trip} from "./trip.model";

export interface Reservation {
  tripID: string;
  quantity: number;
}

export interface ReservationWithTrip extends Reservation {
  trip: Trip;
  selected: boolean;
}

// TODO: zadanie 5, 6, 9
