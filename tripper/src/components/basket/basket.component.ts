import { Component, inject } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Trip } from '../../models/trip.model';
import { ReservationWithTrip } from '../../models/reservation.model';
import { TripService } from '../../services/trip.service';
import { ReservationService } from '../../services/reservation.service';
import { CurrencyService } from '../../services/currency.service';
import {CurrencyConversionPipe} from "../../pipes/currency-conversion.pipe";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-basket',
  standalone: true,
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
  imports: [
    CurrencyConversionPipe,
    NgForOf,
    NgIf,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BasketComponent {
  tripService: TripService = inject(TripService);
  reservationService: ReservationService = inject(ReservationService);
  currencyService: CurrencyService = inject(CurrencyService)
  router: Router = inject(Router);

  trips: Trip[] = [];
  reservations: ReservationWithTrip[] = [];
  selectedCurrency = 'PLN';
  checkoutForm: FormGroup;
  totalPrice: number = 0;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.checkoutForm = this.formBuilder.group({});
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
    });
    this.tripService.getTrips().subscribe((trips) => {
      this.trips = trips;
      const reservations = this.reservationService.getReservations();
      this.reservations = reservations.map((reservation) => {
        const trip = this.trips.find((trip) => trip.id === reservation.tripID);
        if (!trip) {
          throw new Error(`Trip with id ${reservation.tripID} not found`);
        }
        return {
          ...reservation,
          name: trip.name,
          pricePLN: trip.pricePLN,
          selected: true,
        };
      });
      this.calculateTotalPrice();
    });
  }

  removeReservation(reservation: ReservationWithTrip) {
    this.reservationService.removeReservation(reservation);
    this.reservations = this.reservations.filter(
      (r) => r.tripID !== reservation.tripID
    );
    this.calculateTotalPrice();
  }

  incrementQuantity(reservation: ReservationWithTrip) {
    reservation.quantity++;
    this.reservationService.addReservation({tripID: reservation.tripID, quantity: 1});
  }

  decrementQuantity(reservation: ReservationWithTrip) {
    if (reservation.quantity > 1) {
      reservation.quantity--;
      this.reservationService.removeReservation({tripID: reservation.tripID, quantity: 1});
    }
  }

  toggleReservation(reservation: ReservationWithTrip) {
    reservation.selected = !reservation.selected;
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.totalPrice = this.reservations.reduce(
      (sum, r) => (r.selected ? sum + r.pricePLN * r.quantity : sum),
      0
    );
  }

  onSubmit() {
    if (!this.checkoutForm.valid) {
      console.error('Zakup niezrealizowany!');
    }
    this.reservationService.purchase(
      this.reservations.filter((r) => r.selected).map((r) => r.tripID)
    );
    this.router.navigate(['/trips']).then();
  }
}
