export interface Reservation {
  tripID: string;
  quantity: number;
}

export interface ReservationWithTrip extends Reservation {
  name: string;
  pricePLN: number;
  selected: boolean;
}
