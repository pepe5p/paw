import {inject, Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Trip, TripData } from '../models/trip.model';
import { map } from 'rxjs/operators';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  runTransaction,
  setDoc,
} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root',
})
export class TripService {
  tripsCollection;
  trips$: Observable<any[]>;
  firestore: Firestore = inject(Firestore);

  private cheapestTripSubject = new BehaviorSubject<Trip | undefined>(undefined);
  cheapestTrip$ = this.cheapestTripSubject.asObservable();

  private mostExpensiveTripSubject = new BehaviorSubject<Trip | undefined>(undefined);
  mostExpensiveTrip$ = this.mostExpensiveTripSubject.asObservable();

  constructor() {
    this.tripsCollection = collection(this.firestore, 'trips');
    this.trips$ = collectionData(this.tripsCollection, {idField: 'id'});
  }

  getTrips(): Observable<Trip[]> {
    this.updateCheapestTrip();
    this.updateMostExpensiveTrip();
    return this.trips$;
  }

  addTrip(trip: TripData): Observable<boolean> {
    return new Observable<boolean>(observer => {
      setDoc(doc(this.tripsCollection), trip).then(() => {
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

  deleteTrip(trip: Trip): void {
    const tripDoc = doc(this.tripsCollection, trip.id)
    deleteDoc(tripDoc).then(() => {
      this.updateCheapestTrip();
      this.updateMostExpensiveTrip();
    }).catch((error: any) => {
      console.error('Error deleting trip: ', error);
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
      const tripRef = doc(this.firestore, 'trips', id);

      runTransaction(this.firestore, async transaction => {
        let doc = await transaction.get(tripRef);
        if (!doc.exists) {
          throw 'Document does not exist!';
        }
        // const currentPeople = doc.data()?.currentPeople || 0;
        const currentPeople = 0;
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
