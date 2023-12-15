import { Component, OnDestroy } from '@angular/core';
import {TripData, Trip} from '../../models/trip.model';
import { TripService } from "../../services/trip.service";
import { Subscription } from 'rxjs';
import {NgClass, NgForOf, NgIf, NgOptimizedImage, UpperCasePipe} from "@angular/common";
import {CurrencyConversionPipe} from "../../pipes/currency-conversion.pipe";
import {StarRatingComponent} from "../star-rating/star-rating.component";
import {TripsFiltersComponent} from "../trips-filters/trips-filters.component";
import {CurrencyService} from "../../services/currency.service";
import {SearchPipe} from "../../pipes/search.pipe";
import {FormatTimestampPipe} from "../../pipes/format-timestamp.pipe";


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
    FormatTimestampPipe,
  ],
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnDestroy{
  LOW_AVAILABILITY_THRESHOLD = 3;

  trips: Trip[] = [];
  cheapestTripID?: string;
  mostExpensiveTripID?: string;
  private cheapestTripSubscription?: Subscription;
  private mostExpensiveTripSubscription?: Subscription;
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
    return 0 >= trip.maxPeople - this.LOW_AVAILABILITY_THRESHOLD;
  }

  emptySlots(trip: TripData): number {
    return trip.maxPeople;
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
    return 0 >= trip.maxPeople;
  }

  isRemoveButtonHidden(trip: TripData) {
    return 0 <= 0;
  }

  isDeleteButtonHidden(_trip: TripData) {
    return false;
  }

  deleteTrip(trip: Trip) {
    this.tripService.deleteTrip(trip);
  }

  isCheapestTrip(trip: Trip): boolean {
    return trip.id == this.cheapestTripID;
  }

  isMostExpensiveTrip(trip: Trip): boolean {
    return trip.id == this.mostExpensiveTripID;
  }

  updateRating(trip: TripData, stars: number): void {
    return;
  }
}
