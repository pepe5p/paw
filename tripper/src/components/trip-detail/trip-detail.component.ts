import {Component, inject, OnInit} from '@angular/core';
import {TripWithCumulatedReservations} from "../../models/trip.model";
import {CurrencyConversionPipe} from "../../pipes/currency-conversion.pipe";
import {FormatTimestampPipe} from "../../pipes/format-timestamp.pipe";
import {NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {StarRatingComponent} from "../star-rating/star-rating.component";
import {CurrencyService} from "../../services/currency.service";
import {ReservationService} from "../../services/reservation.service";
import {TripService} from "../../services/trip.service";
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";
import {ReviewSectionComponent} from "../review-section/review-section.component";
import {Timestamp} from "@angular/fire/firestore";

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [
    CurrencyConversionPipe,
    FormatTimestampPipe,
    NgIf,
    StarRatingComponent,
    UpperCasePipe,
    NgForOf,
    ReviewSectionComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './trip-detail.component.html',
  styleUrl: './trip-detail.component.css'
})
export class TripDetailComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  tripService: TripService = inject(TripService)
  currencyService: CurrencyService = inject(CurrencyService)
  reservationService: ReservationService = inject(ReservationService);

  gallery: string[] = ["https://picsum.photos/2000/1200", "https://picsum.photos/2000/1201", "https://picsum.photos/2000/1202"];
  trip: TripWithCumulatedReservations = {
    id: '',
    name: '',
    description: '',
    country: '',
    startDate: Timestamp.now(),
    endDate: Timestamp.now(),
    maxPeople: 0,
    pricePLN: 0,
    imageUrl: '',
    reviews: [],
    stars: 0,
    reservationCount: 0,
    userReservationCount: 0
  };
  selectedCurrency = 'PLN';

  ngOnInit(): void {
    this.subscribeToCurrencyChanges();
    const tripID = this.route.snapshot.paramMap.get('id');
    if (!tripID) {
      throw new Error('Trip ID not found in URL');
    }
    this.tripService.getTripByID(tripID).subscribe((trip) => {
      const reservations = this.reservationService.getReservations();
      const reservation = reservations.find((r) => r.tripID === trip.id);
      let finalTrip = {userReservationCount: 0, ...trip};
      if (reservation) {
        finalTrip.userReservationCount = reservation.quantity;
      }
      this.trip = finalTrip;
    });
  }

  private subscribeToCurrencyChanges(): void {
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
    });
  }

  emptySlots(): number {
    return this.trip.maxPeople - this.trip.reservationCount - this.trip.userReservationCount;
  }

  reserveSlot(): void {
    this.trip.userReservationCount++;
    this.reservationService.addReservation(this.trip.id);
  }

  cancelReservation(): void {
    this.trip.userReservationCount--;
    this.reservationService.removeReservation(this.trip.id);
  }

  isAddButtonHidden(): boolean {
    return this.trip.userReservationCount + this.trip.reservationCount >= this.trip.maxPeople;
  }

  isRemoveButtonHidden() {
    return 0 == this.trip.userReservationCount;
  }
}
