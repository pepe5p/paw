import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {Trip, TripFilter, TripWithReviews} from "../../models/trip.model";
import {TripService} from "../../services/trip.service";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";

@Component({
  selector: 'app-trips-filters',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatSliderModule
  ],
  templateUrl: './trips-filters.component.html',
  styleUrl: './trips-filters.component.css'
})
export class FilterComponent implements OnInit {
  tripService: TripService = inject(TripService);

  trips: TripWithReviews[] = [];
  countries: string[] = [];
  filter: TripFilter = {
    name: null,
    country: [],
    startDate: null,
    endDate: null,
    priceFrom: null,
    priceTo: null,
    rating: null,
  };

  filterTrips() {
    this.tripService.filterTrips(this.filter);
  };

  ngOnInit(): void {
    this.tripService.getTrips().subscribe((trips) => {
      this.trips = trips;
      this.countries = this.trips.map((trip: Trip) => trip.country);
    });
    this.tripService.trips$.subscribe((trips) => {
      this.trips = trips;
      this.countries = this.trips.map((trip: Trip) => trip.country);
    });
  }

  highestPrice(): number {
    return Math.max(...this.trips.map((trip: Trip) => trip.pricePLN));
  }

  lowestPrice(): number {
    return Math.min(...this.trips.map((trip: Trip) => trip.pricePLN));
  }

}
