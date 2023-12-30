import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TripService} from "../../services/trip.service";
import {TripData} from "../../models/trip.model";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './create-trip.component.html',
  styleUrl: './create-trip.component.css'
})
export class CreateTripComponent {
  tripForm: FormGroup;

  constructor(
    private tripService: TripService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    let todayDate = new Date().toISOString();
    this.tripForm = this.fb.group({
      name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      startDate: [todayDate, [Validators.required]],
      endDate: [todayDate, [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      maxPeople: ['', [Validators.required, Validators.min(1)]],
      description: [''],
      imageUrl: ['']
    });
  }

  addTrip(): void {
    if (this.tripForm.valid) {
      const startTimestamp = Timestamp.fromDate(new Date(this.tripForm.value.startDate));
      const endTimestamp = Timestamp.fromDate(new Date(this.tripForm.value.endDate));

      const newTrip: TripData = {
        name: this.tripForm.value.name,
        country: this.tripForm.value.country,
        startDate: startTimestamp,
        endDate: endTimestamp,
        pricePLN: this.tripForm.value.price,
        maxPeople: this.tripForm.value.maxPeople,
        description: this.tripForm.value.description,
        imageUrl: "https://picsum.photos/200/300",
      };

      this.tripService.addTrip(newTrip);
      this.router.navigate(['/trips']).then();
    }
  }
}
