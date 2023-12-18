import { Component, OnDestroy } from '@angular/core';
import { Trip } from '../../models/trip.model';
import { TripService } from "../../services/trip.service";
import { Subscription } from 'rxjs';
import {NgClass, NgForOf, NgIf, NgOptimizedImage, UpperCasePipe} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CurrencyConversionPipe} from "../../pipes/currency-conversion.pipe";
import {StarRatingComponent} from "../star-rating/star-rating.component";


@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgOptimizedImage,
    NgClass,
    ReactiveFormsModule,
    UpperCasePipe,
    CurrencyConversionPipe,
    StarRatingComponent,
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
  tripForm: FormGroup;
  showAddForm = false;
  currencies = ['PLN', 'EUR', 'USD'];
  selectedCurrency = this.currencies[0];

  constructor(private tripService: TripService, private fb: FormBuilder) {
    let todayDate = new Date().toISOString().split('T')[0];
    this.tripForm = this.fb.group({
      name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      startDate: [todayDate, [Validators.required]],
      endDate: [todayDate, [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      maxPeople: ['', [Validators.required, Validators.min(1)]],
      description: [''],
      imageUrl: ['']
    });
  }

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

  addTrip(): void {
    if (this.tripForm.valid) {
      const newTrip: Trip = {
        id: (this.trips.length + 1).toString(),
        name: this.tripForm.value.name,
        country: this.tripForm.value.country,
        startDate: this.tripForm.value.startDate,
        endDate: this.tripForm.value.endDate,
        pricePLN: this.tripForm.value.price,
        currentPeople: 0,
        maxPeople: this.tripForm.value.maxPeople,
        description: this.tripForm.value.description,
        imageUrl: "https://picsum.photos/200/300",
        rating: 0,
      };

      this.tripService.addTrip(newTrip).subscribe(() => {
        this.getTrips();
        this.resetForm();
      });
    }
  }

  private resetForm(): void {
    this.tripForm.reset();
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  changeCurrency(currency: string) {
    this.selectedCurrency = currency;
  }

  updateRating(trip: Trip, stars: number): void {
    trip.rating = stars;
  }
}
