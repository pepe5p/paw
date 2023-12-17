import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private trips: Trip[] = [
    {
      id: '1',
      name: 'Wycieczka 1',
      country: 'Polska',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      price: 100,
      currentPeople: 5,
      maxPeople: 10,
      description: 'Opis wycieczki 1',
      imageUrl: 'https://picsum.photos/200/300',
    },
    {
      id: '2',
      name: 'Wycieczka 2',
      country: 'Polska',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      price: 200,
      currentPeople: 10,
      maxPeople: 20,
      description: 'Opis wycieczki 2',
      imageUrl: 'https://picsum.photos/200/300',
    },
    {
      id: '3',
      name: 'Wycieczka 3',
      country: 'Polska',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      price: 300,
      currentPeople: 15,
      maxPeople: 30,
      description: 'Opis wycieczki 3',
      imageUrl: 'https://picsum.photos/200/300',
    },
    {
      id: '4',
      name: 'Wycieczka 4',
      country: 'Polska',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      price: 400,
      currentPeople: 20,
      maxPeople: 40,
      description: 'Opis wycieczki 4',
      imageUrl: 'https://picsum.photos/200/300',
    },
    {
      id: '5',
      name: 'Wycieczka 5',
      country: 'Polska',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      price: 150,
      currentPeople: 25,
      maxPeople: 50,
      description: 'Opis wycieczki 5',
      imageUrl: 'https://picsum.photos/200/300',
    }
  ];

  private cheapestTripSubject = new BehaviorSubject<Trip | undefined>(undefined);
  cheapestTrip$ = this.cheapestTripSubject.asObservable();

  private mostExpensiveTripSubject = new BehaviorSubject<Trip | undefined>(undefined);
  mostExpensiveTrip$ = this.mostExpensiveTripSubject.asObservable();

  getTrips(): Observable<Trip[]> {
    this.updateCheapestTrip();
    this.updateMostExpensiveTrip();
    return of(this.trips);
  }

  getTripById(id: string): Observable<Trip | undefined> {
    const trip = this.trips.find((t) => t.id === id);
    return of(trip);
  }

  addTrip(trip: Trip): Observable<boolean> {
    this.trips.push(trip);
    this.updateCheapestTrip();
    this.updateMostExpensiveTrip();
    return of(true);
  }

  editTrip(trip: Trip): Observable<boolean> {
    const index = this.trips.findIndex((t) => t.id === trip.id);
    this.trips[index] = trip;
    this.updateCheapestTrip();
    this.updateMostExpensiveTrip();
    return of(true);
  }

  deleteTrip(trip: Trip): Observable<boolean> {
    const index = this.trips.findIndex((t) => t.id === trip.id);
    this.trips.splice(index, 1);
    this.updateCheapestTrip();
    this.updateMostExpensiveTrip();
    return of(true);
  }

  reservePlace(id: string): Observable<boolean> {
    const trip = this.trips.find((t) => t.id === id);

    if (trip && trip.currentPeople < trip.maxPeople) {
      trip.currentPeople++;
      return of(true); // Reservation successful
    }

    return of(false); // Reservation failed
  }

  cancelReservation(id: string): Observable<boolean> {
    const trip = this.trips.find((t) => t.id === id);

    if (trip && trip.currentPeople > 0) {
      trip.currentPeople--;
      return of(true); // Cancellation successful
    }

    return of(false); // Cancellation failed
  }

  private updateCheapestTrip(): void {
    const cheapestTrip = this.trips.reduce((min, trip) => (trip.price < min.price ? trip : min), this.trips[0]);
    this.cheapestTripSubject.next(cheapestTrip);
  }

  private updateMostExpensiveTrip(): void {
    const mostExpensiveTrip = this.trips.reduce((max, trip) => (trip.price > max.price ? trip : max), this.trips[0]);
    this.mostExpensiveTripSubject.next(mostExpensiveTrip);
  }
}
