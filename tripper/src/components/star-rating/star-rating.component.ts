// star-rating.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css'],
  imports: [
    NgForOf,
    NgClass
  ],
  standalone: true
})
export class StarRatingComponent {
  @Input() clickable: boolean = true;
  @Input() selectedStars: number = 0;
  @Output() ratingChanged = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];

  rateTrip(stars: number): void {
    if (!this.clickable) {
      return;
    }
    this.selectedStars = stars;
    this.ratingChanged.emit(stars);
  }
}
