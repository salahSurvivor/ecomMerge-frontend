import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { Purchases } from 'src/app/purchases';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-show-purchases',
  templateUrl: './show-purchases.component.html',
  styleUrls: ['./show-purchases.component.css']
})
export class ShowPurchasesComponent {
  purchases: Purchases[] = [];
  id: number;
  @Input() search: string = 'ok';
  @Input() pr: string;
  @Output() dltP = new EventEmitter();

  priceTotal: number;  

  constructor(private mainService: MainService){}

  ngOnInit(): void{
    this.getPurchasesList();
  }

  getPurchasesList() {
    this.mainService.getPurchases().subscribe((purchases) => {
      this.purchases = purchases;
    });
  }

  ngOnChanges(): void{
    if(this.pr == 'clear'){
      this.ngOnInit();
      return;
    }

    else if (!this.pr) { return; }

    this.mainService.getPurchases().subscribe((items) => 
      this.purchases = items.filter((i) => 
        formatDate(new Date(i.dateP), 'MM/dd/yyyy', 'en-US') == formatDate(new Date(this.pr), 'MM/dd/yyyy', 'en-US')
      )
    )
  }

  deletePurchase(): void{
    this.mainService.deletePurchase(this.id).subscribe(() =>  {
      this.purchases = this.purchases.filter((i) => i._id !== this.id)
    }

    );
    this.dltP.emit();
  }

  getId(nb, price): void{
    this.priceTotal = price;
    this.id = nb;
  }
}
