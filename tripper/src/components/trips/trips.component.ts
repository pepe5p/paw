import { Component, OnDestroy } from '@angular/core';
import {Trip, TripWithId} from '../../models/trip.model';
import { TripService } from "../../services/trip.service";
import { Subscription } from 'rxjs';
import {NgClass, NgForOf, NgIf, NgOptimizedImage, UpperCasePipe} from "@angular/common";
import {CurrencyConversionPipe} from "../../pipes/currency-conversion.pipe";
import {StarRatingComponent} from "../star-rating/star-rating.component";
import {TripsFiltersComponent} from "../trips-filters/trips-filters.component";
import {CurrencyService} from "../../services/currency.service";
import {SearchPipe} from "../../pipes/search.pipe";


@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgOptimizedImage,
    NgClass,
    UpperCasePipe,
    CurrencyConversionPipe,
    StarRatingComponent,
    TripsFiltersComponent,
    SearchPipe,
  ],
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnDestroy{
  LOW_AVAILABILITY_THRESHOLD = 3;

  trips: TripWithId[] = [];
  cheapestTripID?: number;
  mostExpensiveTripID?: number;
  private cheapestTripSubscription: Subscription | undefined;
  private mostExpensiveTripSubscription: Subscription | undefined;
  selectedCurrency = 'PLN';
  search: string = '';

  constructor(
    private tripService: TripService,
    private currencyService: CurrencyService,
  ) {}

  ngOnInit(): void {
    this.getTrips();
    this.subscribeToCheapestAndMostExpensiveTrips();
    this.subscribeToCurrencyChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromCheapestAndMostExpensiveTrips();
  }

  getTrips(): TripWithId[] {
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

  isLowAvailability(trip: Trip): boolean {
    return trip.currentPeople >= trip.maxPeople - this.LOW_AVAILABILITY_THRESHOLD;
  }

  emptySlots(trip: Trip): number {
    return trip.maxPeople - trip.currentPeople;
  }

  reserveSlot(trip: TripWithId): void {
    this.tripService.reservePlace(trip.id).subscribe();
  }

  cancelReservation(trip: TripWithId): void {
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

  editTrip(trip: TripWithId) {
    this.tripService.editTrip(trip);
  }

  deleteTrip(trip: TripWithId) {
    this.tripService.deleteTrip(trip);
  }

  isCheapestTrip(trip: TripWithId): boolean {
    return trip.id === this.cheapestTripID;
  }

  isMostExpensiveTrip(trip: TripWithId): boolean {
    return trip.id === this.mostExpensiveTripID;
  }

  updateRating(trip: Trip, stars: number): void {
    trip.rating = stars;
  }
}
