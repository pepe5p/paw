import {Component, inject, OnInit} from '@angular/core';
import { Trip } from '../../models/trip.model';
import { ReservationWithTrip } from '../../models/reservation.model';
import { TripService } from '../../services/trip.service';
import { ReservationService } from '../../services/reservation.service';
import { CurrencyService } from '../../services/currency.service';
import {CurrencyConversionPipe} from "../../pipes/currency-conversion.pipe";
import {NgForOf, NgIf} from "@angular/common";
import {FormatTimestampPipe} from "../../pipes/format-timestamp.pipe";
import {Timestamp} from "@angular/fire/firestore";

@Component({
  selector: 'app-history',
  standalone: true,
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  imports: [
    CurrencyConversionPipe,
    NgForOf,
    NgIf,
    FormatTimestampPipe,
  ]
})
export class HistoryComponent implements OnInit {
  tripService: TripService = inject(TripService);
  reservationService: ReservationService = inject(ReservationService);
  currencyService: CurrencyService = inject(CurrencyService)

  trips: Trip[] = [];
  reservations: ReservationWithTrip[] = [];
  selectedCurrency = 'PLN';

  ngOnInit(): void {
    this.subscribeToChanges();
  }

  private subscribeToChanges(): void {
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
    });
    this.tripService.getTrips().subscribe((trips) => {
      this.trips = trips;
      this.reservationService.getHistoryReservations().subscribe((reservations) => {
        this.reservations = reservations.map((reservation) => {
          const trip = this.trips.find((trip) => trip.id === reservation.tripID.id);
          if (!trip) {
            throw new Error(`Trip with id ${reservation.tripID.id} not found`);
          }
          return {
            ...reservation,
            trip: trip,
            selected: true,
          };
        });
        this.reservations.sort((a, b) => {
          return b.when.toMillis() - a.when.toMillis();
        });
      });
    });
  }

  getStatus(reservation: ReservationWithTrip): number {
    if (reservation.trip.startDate > Timestamp.now()) {
      return 0;
    }
    if (reservation.trip.endDate >= Timestamp.now()) {
      return 1;
    }
    return 2;
  }
}
