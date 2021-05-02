import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IForex } from '../core/IForex';
import { ICurrencySymbol } from '../core/ICurrencySymbol';

@Injectable({
  providedIn: 'root'
})
export class ForexService {
  private baseUrl = 'http://api.exchangeratesapi.io/v1/';
  private accessKey = `?access_key=${environment.apiKey}`;
  private rates: any;
  constructor(private http: HttpClient) {
    this.getLatest();
  }

  getSymbol(): any {
    return this.http.get<ICurrencySymbol[]>(`${this.baseUrl}symbols${this.accessKey}`).pipe(
      map((res: any) =>  {
        const symbols = res.symbols;
        const currencySymbols = Object.keys(symbols);
        const results: any = [];
        currencySymbols.forEach((symbol: string) => results.push({symbol, description: symbols[symbol]}));
        return results;
      }));
  }

  getLatest(): void {
      this.http.get<ICurrencySymbol[]>(`${this.baseUrl}latest${this.accessKey}`).pipe(
        map((res: any) =>  {
          const rates = res.rates;
          return rates;
        })).subscribe(res => {
        this.rates = res;
      });
  }

  convert(forex: IForex): any {
    const derivedFactor = this.rates[`EUR`] / this.rates[forex.currencyFrom];
    const result = (+forex.amount * derivedFactor) * this.rates[forex.currencyTo];
    return {
      amount: result,
      conversionRate: derivedFactor * this.rates[forex.currencyTo]
    };
  }
}


