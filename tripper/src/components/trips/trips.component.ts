import {Component, inject} from '@angular/core';
import {TripData, Trip} from '../../models/trip.model';
import { TripService } from "../../services/trip.service";
import {NgClass, NgForOf, NgIf, NgOptimizedImage, UpperCasePipe} from "@angular/common";
import {CurrencyConversionPipe} from "../../pipes/currency-conversion.pipe";
import {StarRatingComponent} from "../star-rating/star-rating.component";
import {TripsFiltersComponent} from "../trips-filters/trips-filters.component";
import {CurrencyService} from "../../services/currency.service";
import {SearchPipe} from "../../pipes/search.pipe";
import {FormatTimestampPipe} from "../../pipes/format-timestamp.pipe";
import {FormsModule} from "@angular/forms";


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
export class TripsComponent {
  LOW_AVAILABILITY_THRESHOLD = 3;

  currentPage = 1;
  pageSize = 4;
  totalPages = 0;

  trips: Trip[] = [];
  allTrips: Trip[] = [];

  cheapestPricePLN: number = 0;
  highestPricePLN: number = 0;

  selectedCurrency = 'PLN';

  search: string = '';

  tripService: TripService = inject(TripService)
  currencyService: CurrencyService = inject(CurrencyService)

  ngOnInit(): void {
    this.fetchTrips();
    this.subscribeToCurrencyChanges();
  }

  fetchTrips(): void {
    this.tripService.getTrips().subscribe((trips) => {
      this.allTrips = trips
      this.renderTrips();
    });
  }

  renderTrips() {
    this.totalPages = Math.ceil(this.allTrips.length / this.pageSize);
    this.trips = this.allTrips.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    const sortedTrips = this.trips.sort((a, b) => a.pricePLN - b.pricePLN);
    this.cheapestPricePLN = sortedTrips[0].pricePLN;
    this.highestPricePLN = sortedTrips[sortedTrips.length - 1].pricePLN;
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
