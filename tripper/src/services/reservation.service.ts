import {inject, Injectable} from '@angular/core';
import {Reservation} from "../models/reservation.model";
import {collection, collectionData, doc, Firestore, setDoc, Timestamp} from "@angular/fire/firestore";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  reservationsCollection;
  tripsCollection;
  reservations: Reservation[] = [];
  firestore: Firestore = inject(Firestore);
  private reservedTripsCount = new BehaviorSubject<number>(0);
  reservedTripsCount$ = this.reservedTripsCount.asObservable();

  constructor() {
    this.reservationsCollection = collection(this.firestore, 'reservations');
    this.tripsCollection = collection(this.firestore, 'trips');
    this.updateReservedTripsCount();
  }

  updateReservedTripsCount(): void {
    const count = this.reservations.reduce((acc, r) => acc + r.quantity, 0);
    this.reservedTripsCount.next(count);
  }

  getReservations(): Reservation[] {
    return this.reservations;
  }

  getHistoryReservations(): Observable<any[]> {
    return collectionData(this.reservationsCollection);
  }

  addReservation(tripID: string): void {
    const alreadySavedReservation = this.reservations.find(
      r => r.tripID === tripID
    );

    if (alreadySavedReservation) {
      alreadySavedReservation.quantity++;
      this.updateReservedTripsCount();
      return
    }

    this.reservations.push({tripID: tripID, quantity: 1, when: Timestamp.now()});
    this.updateReservedTripsCount();
  }

  removeReservation(tripID: string): void {
    const alreadySavedReservation = this.reservations.find(
      r => r.tripID === tripID
    );

    if (!alreadySavedReservation) {
      return;
    }

    alreadySavedReservation.quantity--;

    if (alreadySavedReservation.quantity <= 0) {
      this.reservations = this.reservations.filter((r) => r.tripID !== tripID);
    }
    this.updateReservedTripsCount();
  }

  purchase(tripIDs: string[]): void {
    for (const tripID of tripIDs) {
      const reservation = this.reservations.find((r) => r.tripID === tripID);
      if (!reservation) {
        throw new Error(`Reservation for trip with id ${tripID} not found`);
      }
      setDoc(doc(this.reservationsCollection), {
        tripID: doc(this.tripsCollection, reservation.tripID),
        when: Timestamp.now(),
        quantity: reservation.quantity,
      }).then(() => {
        console.log(`Reservation ${reservation.tripID} saved`);
      })
      this.reservations = this.reservations.filter((r) => r.tripID !== reservation.tripID);
    }
    this.updateReservedTripsCount();
  }
}
