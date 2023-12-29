import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgForOf} from "@angular/common";
import {CurrencyService} from "../../services/currency.service";

@Component({
  selector: 'app-trips-filters',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgForOf
  ],
  templateUrl: './trips-filters.component.html',
  styleUrl: './trips-filters.component.css'
})
export class TripsFiltersComponent {
}
