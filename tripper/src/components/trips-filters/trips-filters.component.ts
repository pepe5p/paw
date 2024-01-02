import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {Trip, TripFilter, TripWithReservation, TripWithReviews} from "../../models/trip.model";
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
    name: "",
    country: null,
    startDate: new Date(),
    endDate: new Date(),
    priceFrom: 0,
    priceTo: 0,
    rating: null,
  };

  filterTrips() {
    if (this.filter.priceFrom > this.filter.priceTo) {
      this.filter.priceFrom = this.filter.priceTo;
    }
    if (this.filter.startDate > this.filter.endDate) {
      this.filter.startDate = this.filter.endDate;
    }
    if (this.filter.priceFrom < this.lowestPrice()) {
      this.filter.priceFrom = this.lowestPrice();
    }
    if (this.filter.priceTo > this.highestPrice()) {
      this.filter.priceTo = this.highestPrice();
    }
    this.tripService.filterTrips(this.filter);
  };

  ngOnInit(): void {
    this.tripService.getTrips().subscribe((trips) => {
      this.renderFilters(trips);
    });
  }

  renderFilters(trips: TripWithReservation[]): void {
    this.trips = trips;
    this.countries = this.trips.map((trip: Trip) => trip.country);
    this.filter.priceFrom = this.lowestPrice();
    this.filter.priceTo = this.highestPrice();
    this.filter.startDate = this.nearestAndFurthestDates('startDate').furthest;
    this.filter.endDate = this.nearestAndFurthestDates('endDate').nearest;
  }

  highestPrice(): number {
    return Math.max(...this.trips.map((trip: Trip) => trip.pricePLN));
  }

  lowestPrice(): number {
    return Math.min(...this.trips.map((trip: Trip) => trip.pricePLN));
  }

  nearestAndFurthestDates(property: 'startDate' | 'endDate'): { nearest: Date, furthest: Date } {
    const currentDate = new Date();
    const dates = this.trips.map((trip: Trip) => trip[property].toDate());

    const nearestDate = dates.reduce((nearest, current) => (
      Math.abs(current.getTime() - currentDate.getTime()) < Math.abs(nearest.getTime() - currentDate.getTime()) ? current : nearest
    ), dates[0]);

    const furthestDate = dates.reduce((furthest, current) => (
      Math.abs(current.getTime() - currentDate.getTime()) > Math.abs(furthest.getTime() - currentDate.getTime()) ? current : furthest
    ), dates[0]);

    return { nearest: nearestDate, furthest: furthestDate };
  }
}
