import {Component, inject, Input} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { TripWithReviews } from "../../models/trip.model";
import {NgForOf, NgIf} from "@angular/common";
import {StarRatingComponent} from "../star-rating/star-rating.component";
import {Timestamp} from "@angular/fire/firestore";

@Component({
  selector: 'app-review-section',
  templateUrl: './review-section.component.html',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    StarRatingComponent,
    NgForOf
  ],
  styleUrls: ['./review-section.component.css']
})
export class ReviewSectionComponent {
  @Input() trip: TripWithReviews = {
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
    stars: 0
  };

  formBuilder: FormBuilder = inject(FormBuilder);

  reviewForm: FormGroup;

  constructor() {
    this.reviewForm = this.formBuilder.group({
      stars: ['0', [Validators.required, Validators.min(1), Validators.max(5)]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
    });
  }

  onRatingChanged(stars: number): void {
    this.reviewForm.patchValue({ stars });
  }

  submitReview() {
    if (this.reviewForm.valid) {
      const newReview = {
        stars: this.reviewForm.value.stars,
        description: this.reviewForm.value.description,
        author: 'Maciuś'
      };

      this.trip.reviews.push(newReview);
      this.reviewForm.reset();
    } else {
      this.reviewForm.markAllAsTouched();
    }
  }
}
