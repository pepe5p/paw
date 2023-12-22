import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  currencies = ['PLN', 'EUR', 'USD'];
  private selectedCurrencySubject = new BehaviorSubject<string>(this.currencies[0]);

  selectedCurrency$ = this.selectedCurrencySubject.asObservable();

  changeCurrency(currency: string) {
    if (this.isValidCurrency(currency)) {
      this.selectedCurrencySubject.next(currency);
    } else {
      console.error(`Invalid currency: ${currency}`);
    }
  }

  private isValidCurrency(currency: string): boolean {
    return this.currencies.includes(currency);
  }
}
