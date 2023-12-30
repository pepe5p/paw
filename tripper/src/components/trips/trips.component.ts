import {Component, inject, OnInit} from '@angular/core';
import {TripData, Trip, TripWithCumulatedReservations} from '../../models/trip.model';
import { TripService } from "../../services/trip.service";
import {NgClass, NgForOf, NgIf, NgOptimizedImage, UpperCasePipe} from "@angular/common";
import {CurrencyConversionPipe} from "../../pipes/currency-conversion.pipe";
import {StarRatingComponent} from "../star-rating/star-rating.component";
import {TripsFiltersComponent} from "../trips-filters/trips-filters.component";
import {CurrencyService} from "../../services/currency.service";
import {SearchPipe} from "../../pipes/search.pipe";
import {FormatTimestampPipe} from "../../pipes/format-timestamp.pipe";
import {FormsModule} from "@angular/forms";
import {ReservationService} from "../../services/reservation.service";


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
    FormsModule,
  ],
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {
  LOW_AVAILABILITY_THRESHOLD = 3;

  currentPage = 1;
  pageSize = 12;
  totalPages = 0;

  trips: TripWithCumulatedReservations[] = [];
  allTrips: TripWithCumulatedReservations[] = [];

  cheapestPricePLN: number = 0;
  highestPricePLN: number = 0;

  selectedCurrency = 'PLN';

  search: string = '';

  tripService: TripService = inject(TripService)
  currencyService: CurrencyService = inject(CurrencyService)
  reservationService: ReservationService = inject(ReservationService);

  ngOnInit(): void {
    this.fetchTrips();
    this.subscribeToCurrencyChanges();
  }

  fetchTrips(): void {
    this.tripService.getTrips().subscribe((trips) => {
      const reservations = this.reservationService.getReservations();
      const finalTrips = [];
      for (const trip of trips) {
        const reservation = reservations.find((r) => r.tripID === trip.id);
        let finalTrip = {userReservationCount: 0, ...trip};
        if (reservation) {
          finalTrip.userReservationCount = reservation.quantity;
        }
        finalTrips.push(finalTrip);
      }
      this.allTrips = finalTrips
      this.renderTrips();
    });
  }

  renderTrips() {
    this.totalPages = Math.ceil(this.allTrips.length / this.pageSize);
    this.trips = this.allTrips.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    const sortedTrips = [...this.allTrips]
    sortedTrips.sort((a, b) => a.pricePLN - b.pricePLN);
    this.cheapestPricePLN = sortedTrips[0].pricePLN;
    this.highestPricePLN = sortedTrips[sortedTrips.length - 1].pricePLN;
  }


  private subscribeToCurrencyChanges(): void {
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
    });
  }

  emptySlots(trip: TripWithCumulatedReservations): number {
    return trip.maxPeople - trip.reservationCount - trip.userReservationCount;
  }

  reserveSlot(trip: TripWithCumulatedReservations): void {
    trip.userReservationCount++;
    this.reservationService.addReservation({tripID: trip.id, quantity: 1});
    this.renderTrips();
  }

  cancelReservation(trip: TripWithCumulatedReservations): void {
    trip.userReservationCount--;
    this.reservationService.removeReservation({tripID: trip.id, quantity: 1});
    this.renderTrips();
  }

  isLowAvailability(trip: TripWithCumulatedReservations): boolean {
    return trip.userReservationCount + trip.reservationCount >= trip.maxPeople - this.LOW_AVAILABILITY_THRESHOLD;
  }

  isAddButtonHidden(trip: TripWithCumulatedReservations): boolean {
    return trip.userReservationCount + trip.reservationCount >= trip.maxPeople;
  }

  isRemoveButtonHidden(trip: TripWithCumulatedReservations) {
    return 0 == trip.userReservationCount;
  }

  isDeleteButtonHidden(_trip: TripData) {
    return false;
  }

  deleteTrip(trip: Trip) {
    this.tripService.deleteTrip(trip);
  }

  isCheapestTrip(trip: Trip): boolean {
    return trip.pricePLN == this.cheapestPricePLN;
  }

  isMostExpensiveTrip(trip: Trip): boolean {
    return trip.pricePLN == this.highestPricePLN;
  }

  updateRating(trip: TripData, stars: number): void {
    return;
  }

  nextPage(): void {
    this.currentPage++;
    this.renderTrips();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderTrips();
    }
  }

  changePageSize(): void {
    const selectElement = document.getElementById('pageSizeSelect') as HTMLSelectElement;
    this.pageSize = +selectElement.value;
    this.currentPage = 1;
    this.renderTrips();
  }
}
