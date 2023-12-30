import {Trip} from "./trip.model";
import {Timestamp} from "@angular/fire/firestore";

export interface Reservation {
  tripID: string;
  when: Timestamp;
  quantity: number;
}

export interface ReservationWithTrip extends Reservation {
  trip: Trip;
  selected: boolean;
}

// TODO: zadanie 5, 6
