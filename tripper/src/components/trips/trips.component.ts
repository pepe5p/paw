import {Component, inject, OnDestroy} from '@angular/core';
import {TripData, Trip} from '../../models/trip.model';
import { TripService } from "../../services/trip.service";
import { Subscription } from 'rxjs';
import {CurrencyService} from "../../services/currency.service";


@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnDestroy{
  LOW_AVAILABILITY_THRESHOLD = 3;

  tripService: TripService = inject(TripService);
  currencyService: CurrencyService = inject(CurrencyService);
  trips: Trip[] = [];
  cheapestTripID?: string;
  mostExpensiveTripID?: string;
  private cheapestTripSubscription: Subscription | undefined;
  private mostExpensiveTripSubscription: Subscription | undefined;
  selectedCurrency = 'PLN';
  search: string = '';

  constructor() {}

  ngOnInit(): void {
    this.getTrips();
    this.subscribeToCheapestAndMostExpensiveTrips();
    this.subscribeToCurrencyChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromCheapestAndMostExpensiveTrips();
  }

  getTrips(): Trip[] {
    this.tripService.getTrips().subscribe((trips) => {
      this.trips = trips;
    });
    return this.trips;
  }

  private subscribeToCurrencyChanges(): void {
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
    });
  }

  isLowAvailability(trip: TripData): boolean {
    return trip.currentPeople >= trip.maxPeople - this.LOW_AVAILABILITY_THRESHOLD;
  }

  emptySlots(trip: TripData): number {
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
      this.cheapestTripID = cheapestTrip?.id;
    });

    this.mostExpensiveTripSubscription = this.tripService.mostExpensiveTrip$.subscribe((mostExpensiveTrip) => {
      this.mostExpensiveTripID = mostExpensiveTrip?.id;
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

  isAddButtonHidden(trip: TripData): boolean {
    return trip.currentPeople >= trip.maxPeople;
  }

  isRemoveButtonHidden(trip: TripData) {
    return trip.currentPeople <= 0;
  }

  isEditButtonHidden(_trip: TripData) {
    return false;
  }

  isDeleteButtonHidden(_trip: TripData) {
    return false;
  }

  editTrip(trip: Trip) {
    this.tripService.editTrip(trip);
  }

  deleteTrip(trip: Trip) {
    this.tripService.deleteTrip(trip);
  }

  isCheapestTrip(trip: Trip): boolean {
    return trip.id === this.cheapestTripID;
  }

  isMostExpensiveTrip(trip: Trip): boolean {
    return trip.id === this.mostExpensiveTripID;
  }

  updateRating(trip: TripData, stars: number): void {
    trip.rating = stars;
  }
}
