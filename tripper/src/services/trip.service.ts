import {inject, Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Trip, TripData } from '../models/trip.model';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  runTransaction,
  setDoc,
} from "@angular/fire/firestore";

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
}
