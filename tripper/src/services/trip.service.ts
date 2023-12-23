import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Trip } from '../models/trip.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private tripsCollection: AngularFirestoreCollection<Trip>;
  trips$: Observable<Trip[]>;

  private cheapestTripSubject = new BehaviorSubject<TripWithId | undefined>(undefined);
  cheapestTrip$ = this.cheapestTripSubject.asObservable();

  private mostExpensiveTripSubject = new BehaviorSubject<TripWithId | undefined>(undefined);
  mostExpensiveTrip$ = this.mostExpensiveTripSubject.asObservable();

  constructor(private firestore: AngularFirestore) {
    this.tripsCollection = this.firestore.collection<Trip>('trips');
    this.trips$ = this.tripsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Trip;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getTrips(): Observable<TripWithId[]> {
    this.updateCheapestTrip();
    this.updateMostExpensiveTrip();
    return this.trips$;
  }

  getTripById(id: number): Observable<TripWithId | undefined> {
    return this.trips$.pipe(
      map(trips => trips.find(trip => trip.id === id))
    );
  }

  addTrip(trip: Trip): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.tripsCollection.add(trip).then(() => {
        this.updateCheapestTrip();
        this.updateMostExpensiveTrip();
        observer.next(true);
        observer.complete();
      }).catch(error => {
        console.error('Error adding trip: ', error);
        observer.next(false);
        observer.complete();
      });
    });
  }

  editTrip(trip: TripWithId): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.tripsCollection.doc(trip.id).update(trip).then(() => {
        this.updateCheapestTrip();
        this.updateMostExpensiveTrip();
        observer.next(true);
        observer.complete();
      }).catch(error => {
        console.error('Error updating trip: ', error);
        observer.next(false);
        observer.complete();
      });
    });
  }

  deleteTrip(trip: TripWithId): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.tripsCollection.doc(trip.id).delete().then(() => {
        this.updateCheapestTrip();
        this.updateMostExpensiveTrip();
        observer.next(true);
        observer.complete();
      }).catch(error => {
        console.error('Error deleting trip: ', error);
        observer.next(false);
        observer.complete();
      });
    });
  }

  reservePlace(id: string): Observable<boolean> {
    return this.updatePeopleCount(id, 1);
  }

  cancelReservation(id: string): Observable<boolean> {
    return this.updatePeopleCount(id, -1);
  }

  private updatePeopleCount(id: string, change: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      const tripRef = this.tripsCollection.doc(id);

      this.firestore.firestore.runTransaction(async transaction => {
        let doc = await transaction.get(tripRef);
        if (!doc.exists) {
          throw 'Document does not exist!';
        }
        const currentPeople = doc.data()?.currentPeople || 0;
        const newPeopleCount = currentPeople + change;
        if (newPeopleCount >= 0) {
          transaction.update(tripRef, {currentPeople: newPeopleCount});
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }).catch(error => {
        console.error('Error updating people count: ', error);
        observer.next(false);
        observer.complete();
      });
    });
  }

  private updateCheapestTrip(): void {
    this.trips$.pipe(
      map(trips => trips.reduce((min, trip) => (trip.pricePLN < min.pricePLN ? trip : min), trips[0]))
    ).subscribe(cheapestTrip => {
      this.cheapestTripSubject.next(cheapestTrip);
    });
  }


  private updateMostExpensiveTrip(): void {
    this.trips$.pipe(
      map(trips => trips.reduce((max, trip) => (trip.pricePLN > max.pricePLN ? trip : max), trips[0]))
    ).subscribe(mostExpensiveTrip => {
      this.mostExpensiveTripSubject.next(mostExpensiveTrip);
    });
  }
}
