import { Component, OnDestroy } from '@angular/core';
import { Trip } from '../../models/trip.model';
import { TripService } from "../../services/trip.service";
import { Subscription } from 'rxjs';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnDestroy{
  LOW_AVAILABILITY_THRESHOLD = 3;

  trips: Trip[] = [];
  cheapestTrip?: Trip;
  mostExpensiveTrip?: Trip;
  private cheapestTripSubscription: Subscription | undefined;
  private mostExpensiveTripSubscription: Subscription | undefined;

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.getTrips();
    this.subscribeToCheapestAndMostExpensiveTrips();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromCheapestAndMostExpensiveTrips();
  }

  getTrips(): void {
    this.tripService.getTrips().subscribe((trips) => {
      this.trips = trips;
    });
  }

  isLowAvailability(trip: Trip): boolean {
    return trip.currentPeople >= trip.maxPeople - this.LOW_AVAILABILITY_THRESHOLD;
  }

  emptySlots(trip: Trip): number {
    return trip.maxPeople - trip.currentPeople;
  }

  reserveSlot(trip: Trip): void {
    this.tripService.reservePlace(trip.id).subscribe();
  }

  cancelReservation(trip: Trip): void {
    this.tripService.cancelReservation(trip.id).subscribe();
  }

  private subscribeToCheapestAndMostExpensiveTrips(): void {
    this.cheapestTripSubscription = this.tripService.cheapestTrip$.subscribe((cheapestTrip) => {
      this.cheapestTrip = cheapestTrip;
    });

    this.mostExpensiveTripSubscription = this.tripService.mostExpensiveTrip$.subscribe((mostExpensiveTrip) => {
      this.mostExpensiveTrip = mostExpensiveTrip;
    });
  }

  private unsubscribeFromCheapestAndMostExpensiveTrips(): void {
    if (this.cheapestTripSubscription) {
      this.cheapestTripSubscription.unsubscribe();
    }
    if (this.mostExpensiveTripSubscription) {
      this.mostExpensiveTripSubscription.unsubscribe();
    }
  }

  isAddButtonHidden(trip: Trip): boolean {
    return trip.currentPeople >= trip.maxPeople;
  }

  isRemoveButtonHidden(trip: Trip) {
    return trip.currentPeople <= 0;
  }

  isEditButtonHidden(_trip: Trip) {
    return false;
  }

  isDeleteButtonHidden(_trip: Trip) {
    return false;
  }

  editTrip(trip: Trip) {
    this.tripService.editTrip(trip);
  }

  deleteTrip(trip: Trip) {
    this.tripService.deleteTrip(trip);
  }

  isCheapestTrip(trip: Trip): boolean {
    return trip === this.cheapestTrip;
  }

  isMostExpensiveTrip(trip: Trip): boolean {
    return trip === this.mostExpensiveTrip;
  }
}
