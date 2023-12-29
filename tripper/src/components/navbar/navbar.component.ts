import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NgForOf} from "@angular/common";
import {CurrencyService} from "../../services/currency.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
    imports: [
        RouterLink,
        RouterOutlet,
        RouterLinkActive,
        NgForOf
    ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  currencies = this.currencyService.currencies;
  selectedCurrency = 'PLN'

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.subscribeToCurrencyChanges();
  }

  private subscribeToCurrencyChanges(): void {
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
    });
  }

  changeCurrency(currency: string) {
    this.currencyService.changeCurrency(currency);
  }
}
