import {Component, inject, OnInit} from '@angular/core';
import {ReservationService} from "../../services/reservation.service";

@Component({
  selector: 'app-trip-counter',
  standalone: true,
  templateUrl: './trip-counter.component.html',
  styleUrl: './trip-counter.component.css'
})
export class TripCounterComponent implements OnInit {
  reservedTripsCount: number = 0;
  reservationService: ReservationService = inject(ReservationService);

  constructor() {}

  ngOnInit(): void {
    this.reservationService.reservedTripsCount$.subscribe((count: number) => {
        this.reservedTripsCount = count;
    });
  }
}
