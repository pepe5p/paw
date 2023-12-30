import {inject, Injectable} from '@angular/core';
import {concatMap, forkJoin, from, map, Observable} from 'rxjs';
import {Trip, TripData, TripWithReservation} from '../models/trip.model';
import {collection, deleteDoc, doc, Firestore, getDoc, getDocs, setDoc,} from "@angular/fire/firestore";

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

  getTripByID(tripID: string): Observable<TripWithReservation> {
    const tripDoc$ = from(getDoc(doc(this.tripsCollection, tripID)));
    const reservations$ = from(getDocs(this.reservationsCollection));

    return forkJoin({
      tripDoc: tripDoc$,
      reservations: reservations$,
    }).pipe(
      concatMap(({ tripDoc, reservations }) => {
        const trip = tripDoc.data();
        const reservation_count = reservations.docs
          .filter((reservation) => reservation.data()['tripID'].id === tripID)
          .reduce((sum, reservation) => sum + reservation.data()['quantity'], 0);

        // Assuming there is a reviews collection inside the trip document
        const reviews$ = from(getDocs(collection(this.tripsCollection, tripID, 'reviews')));

        return reviews$.pipe(
          map(reviews => {
            const reviewsData = reviews.docs.map(review => review.data());
            return {
              id: tripID,
              reservationCount: reservation_count,
              reviews: reviewsData,
              stars: reviewsData.reduce((sum, review) => sum + review["stars"], 0) / reviewsData.length,
              ...trip,
            } as TripWithReservation;
          })
        );
      })
    );
  }

  getTrips(): Observable<TripWithReservation[]> {
    const reservations$ = from(getDocs(this.reservationsCollection));
    const trips$ = from(getDocs(this.tripsCollection));

    return forkJoin({
      reservations: reservations$,
      trips: trips$,
    }).pipe(
      map(({ reservations, trips }) => {
        return trips.docs.map((tripDoc) => {
          const tripId = tripDoc.id;
          const reservation_count = reservations.docs
            .filter((reservation) => reservation.data()['tripID'].id === tripId)
            .reduce((sum, reservation) => sum + reservation.data()['quantity'], 0);

          // Assuming there is a reviews collection inside the trip document
          const reviews$ = from(getDocs(collection(this.tripsCollection, tripId, 'reviews')));

          return reviews$.pipe(
            map(reviews => {
              const reviewsData = reviews.docs.map(review => review.data());
              return {
                id: tripId,
                reservationCount: reservation_count,
                reviews: reviewsData,
                stars: reviewsData.reduce((sum, review) => sum + review["stars"], 0) / reviewsData.length,
                ...tripDoc.data(),
              } as TripWithReservation;
            })
          );
        });
      }),
      concatMap(tripsWithReviews$ => forkJoin(tripsWithReviews$))
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
