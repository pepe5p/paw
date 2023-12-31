import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'currencyConversion'
})
export class CurrencyConversionPipe implements PipeTransform {
  transform(pricePLN: number, targetCurrency: string): string {
    switch (targetCurrency) {
      case 'USD':
        return `${(pricePLN / 4).toFixed(2)} $`;
      case 'EUR':
        return `${(pricePLN / 4.5).toFixed(2)} €`;
      default:
        return `${pricePLN.toFixed(2)} zł`;
    }
  }
}
