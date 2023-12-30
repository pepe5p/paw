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

// TODO: zadania9: 5, 6, 9
// TODO: zadania10: 1
