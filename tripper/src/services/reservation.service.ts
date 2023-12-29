import {inject, Injectable} from '@angular/core';
import {Reservation} from "../models/reservation.model";
import {collection, doc, Firestore, setDoc} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  reservationsCollection;
  tripsCollection;
  reservations: Reservation[] = [];
  firestore: Firestore = inject(Firestore);

  constructor() {
    this.reservationsCollection = collection(this.firestore, 'reservations');
    this.tripsCollection = collection(this.firestore, 'trips');
  }

  getReservations(): Reservation[] {
    return this.reservations;
  }

  addReservation(reservation: Reservation): void {
    const alreadySavedReservation = this.reservations.find(
      r => r.tripID === reservation.tripID
    );

    if (alreadySavedReservation) {
      alreadySavedReservation.quantity += reservation.quantity;
      return
    }

    this.reservations.push(reservation);
  }

  removeReservation(reservation: Reservation): void {
    const alreadySavedReservation = this.reservations.find(
      r => r.tripID === reservation.tripID
    );

    if (!alreadySavedReservation) {
      return;
    }

    alreadySavedReservation.quantity -= reservation.quantity;

    if (alreadySavedReservation.quantity <= 0) {
      this.reservations = this.reservations.filter((r) => r.tripID !== reservation.tripID);
    }
  }

  purchase(tripIDs: string[]): void {
    for (const tripID of tripIDs) {
      const reservation = this.reservations.find((r) => r.tripID === tripID);
      if (!reservation) {
        throw new Error(`Reservation for trip with id ${tripID} not found`);
      }
      setDoc(doc(this.reservationsCollection), {
        tripID: doc(this.tripsCollection, reservation.tripID),
        quantity: reservation.quantity,
      }).then(() => {
        console.log(`Reservation ${reservation.tripID} saved`);
      })
      this.reservations = this.reservations.filter((r) => r.tripID !== reservation.tripID);
    }
  }
}
