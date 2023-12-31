import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {Trip, TripFilter, TripWithReviews} from "../../models/trip.model";
import {TripService} from "../../services/trip.service";

@Component({
  selector: 'app-trips-filters',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
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
    rating: [],
  };

  filterTrips() {
    this.tripService.filterTrips(this.filter);
  };

  ngOnInit(): void {
    this.tripService.trips$.subscribe((trips) => {
      this.trips = trips;
    });
    this.countries = this.trips.map((trip: Trip) => trip.country);
  }

  addCountry(country: string) {
    if (!this.filter.country.includes(country)) {
      this.filter.country.push(country);
    }
    this.filterTrips();
  }

  removeCountry(country: string) {
    this.filter.country = this.filter.country.filter((c: string) => c !== country);
    this.filterTrips();
  }

  addRating(rating: number) {
    if (!this.filter.rating.includes(rating)) {
      this.filter.rating.push(rating);
    }
    this.filterTrips();
  }

  removeRating(rating: number) {
    this.filter.rating = this.filter.rating.filter((r: number) => r !== rating);
    this.filterTrips();
  }

  highestPrice(): number {
    return Math.max(...this.trips.map((trip: Trip) => trip.pricePLN));
  }

  lowestPrice(): number {
    return Math.min(...this.trips.map((trip: Trip) => trip.pricePLN));
  }
}
