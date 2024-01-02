import {inject, Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, concatMap, forkJoin, from, map, Observable} from 'rxjs';
import {Trip, TripData, TripFilter, TripWithReservation} from '../models/trip.model';
import {collection, deleteDoc, doc, Firestore, getDoc, getDocs, setDoc, Timestamp,} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root',
})
export class TripService implements OnInit {
  firestore: Firestore = inject(Firestore);

  reservationsCollection = collection(this.firestore, 'reservations');
  tripsCollection = collection(this.firestore, 'trips');

  private tripsSubject = new BehaviorSubject<TripWithReservation[]>([]);
  trips$ = this.tripsSubject.asObservable();

  ngOnInit() {
    this.getTrips().subscribe((trips) => {
      this.tripsSubject.next(trips);
    });
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

        const reviews$ = from(getDocs(collection(this.tripsCollection, tripID, 'reviews')));

        return reviews$.pipe(
          map(reviews => {
            const reviewsData = reviews.docs.map(review => review.data());
            let stars;
            if (reviewsData.length === 0) {
              stars = 0;
            }
            else {
              stars = reviewsData.reduce((sum, review) => sum + review["stars"], 0) / reviewsData.length;
            }
            return {
              id: tripID,
              reservationCount: reservation_count,
              reviews: reviewsData,
              stars: stars,
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

          const reviews$ = from(getDocs(collection(this.tripsCollection, tripId, 'reviews')));

          return reviews$.pipe(
            map(reviews => {
              const reviewsData = reviews.docs.map(review => review.data());
              let stars;
              if (reviewsData.length === 0) {
                stars = 0;
              }
              else {
                stars = reviewsData.reduce((sum, review) => sum + review["stars"], 0) / reviewsData.length;
              }
              return {
                id: tripId,
                reservationCount: reservation_count,
                reviews: reviewsData,
                stars: stars,
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

  filterTrips(filter: TripFilter){
    console.log(filter.startDate);
    console.log(filter.endDate);

    const startDate = filter.startDate ? Timestamp.fromDate(filter.startDate) : null;
    const endDate = filter.endDate ? Timestamp.fromDate(filter.endDate) : null;

    this.getTrips().subscribe((trips) => {
      const filteredTrips = trips.filter((trip) => {
        let name = filter.name == '' || trip.name.toLowerCase().includes(filter.name.toLowerCase());
        let country = filter.country == null || filter.country === trip.country;
        let startDateCheck = startDate == null || startDate.toMillis() <= trip.startDate.toMillis();
        let endDateCheck = endDate == null || endDate.toMillis() >= trip.endDate.toMillis();
        let priceFrom = filter.priceFrom == null || filter.priceFrom <= trip.pricePLN;
        let priceTo = filter.priceTo == null || filter.priceTo >= trip.pricePLN;
        let rating = filter.rating == null || filter.rating <= Math.floor(trip.stars);
        return name && country && startDateCheck && endDateCheck && priceFrom && priceTo && rating;
      });

      this.tripsSubject.next(filteredTrips);
    });
  }
}
