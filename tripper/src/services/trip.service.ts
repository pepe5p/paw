import {inject, Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Trip, TripData } from '../models/trip.model';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore, limit, orderBy, query,
  runTransaction,
  setDoc, startAt,
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

  getTrips(): Observable<any[]> {
    const q = query(
      this.tripsCollection,
      orderBy("startDate"),
    );
    return collectionData(q, {idField: 'id'});
  }

  addTrip(trip: TripData): Observable<boolean> {
    return new Observable<boolean>(observer => {
      setDoc(doc(this.tripsCollection), trip).then(() => {
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
    deleteDoc(tripDoc).then(() => {}).catch((error: any) => {
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
}
