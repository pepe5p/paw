import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TripService} from "../../services/trip.service";
import {Trip} from "../../models/trip.model";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-create-trip',
  providers: [
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
    let todayDate = new Date().toISOString().split('T')[0];
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
      const newTrip: Trip = {
        name: this.tripForm.value.name,
        country: this.tripForm.value.country,
        startDate: this.tripForm.value.startDate,
        endDate: this.tripForm.value.endDate,
        pricePLN: this.tripForm.value.price,
        currentPeople: 0,
        maxPeople: this.tripForm.value.maxPeople,
        description: this.tripForm.value.description,
        imageUrl: "https://picsum.photos/200/300",
        rating: 0,
      };

      this.tripService.addTrip(newTrip).subscribe(() => {
        this.router.navigate(['/trips']).then();
      });
    }
  }
}
