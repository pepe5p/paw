import {Component, inject, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {ReservationService} from "../../services/reservation.service";
import {TripService} from "../../services/trip.service";

@Component({
  selector: 'app-trip-alert',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './trip-alert.component.html',
  styleUrl: './trip-alert.component.css'
})
export class TripAlertComponent implements OnInit {
  tripService: TripService = inject(TripService);
  reservationService: ReservationService = inject(ReservationService);

  shouldDisplay: boolean = false;

  ngOnInit(): void {
    this.tripService.getTrips().subscribe((trips) => {
      this.reservationService.getHistoryReservations().subscribe((reservations) => {
        const reservationsWithTrips = reservations.map((reservation) => {
          const trip = trips.find((trip) => trip.id === reservation.tripID.id);
          if (!trip) {
            throw new Error(`Trip with id ${reservation.tripID.id} not found`);
          }
          return {
            ...reservation,
            trip: trip,
            selected: true,
          };
        });
        this.shouldDisplay = reservationsWithTrips.some((reservation) => {
          const condition_1 = reservation.trip.startDate.toMillis() - 7 * 24 * 60 * 60 * 1000 < Date.now();
          const condition_2 = reservation.trip.startDate.toMillis() > Date.now();
          return condition_1 && condition_2;
        });
      });
    });
  }
}
