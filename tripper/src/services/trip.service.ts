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
      pricePLN: 100,
      currentPeople: 5,
      maxPeople: 10,
      description: 'Opis wycieczki 1',
      imageUrl: 'https://picsum.photos/200/300',
      rating: 4.7,
    },
    {
      id: '2',
      name: 'Wycieczka 2',
      country: 'Polska',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      pricePLN: 200,
      currentPeople: 10,
      maxPeople: 20,
      description: 'Opis wycieczki 2',
      imageUrl: 'https://picsum.photos/200/300',
      rating: 4.7,
    },
    {
      id: '3',
      name: 'Wycieczka 3',
      country: 'Polska',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      pricePLN: 300,
      currentPeople: 15,
      maxPeople: 30,
      description: 'Opis wycieczki 3',
      imageUrl: 'https://picsum.photos/200/300',
      rating: 3.7,
    },
    {
      id: '4',
      name: 'Wycieczka 4',
      country: 'Polska',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      pricePLN: 400,
      currentPeople: 20,
      maxPeople: 40,
      description: 'Opis wycieczki 4',
      imageUrl: 'https://picsum.photos/200/300',
      rating: 4.7,
    },
    {
      id: '5',
      name: 'Wycieczka 5',
      country: 'Polska',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      pricePLN: 150,
      currentPeople: 25,
      maxPeople: 50,
      description: 'Opis wycieczki 5',
      imageUrl: 'https://picsum.photos/200/300',
      rating: 5.0,
    },
    {
      id: '6',
      name: 'Wycieczka 6',
      country: 'Polska',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      pricePLN: 250,
      currentPeople: 30,
      maxPeople: 60,
      description: 'Opis wycieczki 6',
      imageUrl: 'https://picsum.photos/200/300',
      rating: 2.3,
    },
    {
      id: '7',
      name: 'Wycieczka 7',
      country: 'Polska',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      pricePLN: 350,
      currentPeople: 35,
      maxPeople: 70,
      description: 'Opis wycieczki 7',
      imageUrl: 'https://picsum.photos/200/300',
      rating: 4.7,
    },
    {
      id: '8',
      name: 'Wycieczka 8',
      country: 'Polska',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      pricePLN: 450,
      currentPeople: 40,
      maxPeople: 80,
      description: 'Opis wycieczki 8',
      imageUrl: 'https://picsum.photos/200/300',
      rating: 4.7,
    },
    {
      id: '9',
      name: 'Wycieczka 9',
      country: 'Polska',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      pricePLN: 550,
      currentPeople: 45,
      maxPeople: 90,
      description: 'Opis wycieczki 9',
      imageUrl: 'https://picsum.photos/200/300',
      rating: 4.7,
    },
    {
      id: '10',
      name: 'Wycieczka 10',
      country: 'Polska',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      pricePLN: 650,
      currentPeople: 50,
      maxPeople: 100,
      description: 'Opis wycieczki 10',
      imageUrl: 'https://picsum.photos/200/300',
      rating: 4.7,
    },
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
    const cheapestTrip = this.trips.reduce((min, trip) => (trip.pricePLN < min.pricePLN ? trip : min), this.trips[0]);
    this.cheapestTripSubject.next(cheapestTrip);
  }

  private updateMostExpensiveTrip(): void {
    const mostExpensiveTrip = this.trips.reduce((max, trip) => (trip.pricePLN > max.pricePLN ? trip : max), this.trips[0]);
    this.mostExpensiveTripSubject.next(mostExpensiveTrip);
  }
}
