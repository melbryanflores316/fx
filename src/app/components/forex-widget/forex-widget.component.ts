import { Component } from '@angular/core';
import { ICurrencySymbol } from '../../core/ICurrencySymbol';
import { IForex } from '../../core/IForex';
import { BehaviorSubject } from 'rxjs';
import { IForexResult } from '../../core/IForexResult';
import { ForexService } from '../../services/forex.service';

@Component({
  selector: 'app-forex-widget',
  templateUrl: './forex-widget.component.html',
  styleUrls: ['./forex-widget.component.scss']
})
export class ForexWidgetComponent {

  currencies: ICurrencySymbol[] = [];
  forex: IForex = {
    amount: 0,
    currencyFrom: '',
    currencyTo: ''
  };
  result: BehaviorSubject<IForexResult> =  new BehaviorSubject<IForexResult>({amount: 0, conversionRate: 0});
  constructor(private forexService: ForexService) {
    this.forexService.getSymbol().subscribe((res: any) => this.currencies = res);
  }

  convert(key: string, event: any): void {
    // @ts-ignore
    this.forex[key] = event.value;
    if ( this.forex.currencyTo !== '' && this.forex.currencyFrom !== '') {
      this.result.next(this.forexService.convert(this.forex));
    }
  }
}
