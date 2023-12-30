import {inject, Injectable} from '@angular/core';
import {forkJoin, from, map, Observable} from 'rxjs';
import {Trip, TripData, TripWithReservation} from '../models/trip.model';
import {collection, deleteDoc, doc, Firestore, getDocs, setDoc,} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root',
})
export class TripService {
  reservationsCollection;
  tripsCollection;
  firestore: Firestore = inject(Firestore);

  constructor() {
    this.reservationsCollection = collection(this.firestore, 'reservations');
    this.tripsCollection = collection(this.firestore, 'trips');
  }

  getTrips(): Observable<TripWithReservation[]> {
    return forkJoin({
      reservations: from(getDocs(this.reservationsCollection)),
      trips: from(getDocs(this.tripsCollection)),
    }).pipe(
      map(({ reservations, trips }) => {
        return trips.docs.map((tripDoc) => {
          const tripId = tripDoc.id;
          const reservation_count = reservations.docs
            .filter((reservation) => {
              return reservation.data()['tripID'].id === tripId;
            })
            .reduce((sum, reservation) => sum + reservation.data()['quantity'], 0);

          return {
            id: tripId,
            reservation_count,
            ...tripDoc.data(),
          } as TripWithReservation;
        });
      })
    );
  }

  addTrip(trip: TripData): boolean {
    setDoc(doc(this.tripsCollection), trip).then(() => {
      return true;
    }).catch(error => {
      console.error('Error adding trip: ', error);
    });
    return false;
  }

  deleteTrip(trip: Trip): void {
    const tripDoc = doc(this.tripsCollection, trip.id)
    deleteDoc(tripDoc).then(() => {}).catch((error: any) => {
      console.error('Error deleting trip: ', error);
    });
  }
}
