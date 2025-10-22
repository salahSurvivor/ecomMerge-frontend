import { Component } from '@angular/core';
import { MainService } from 'src/app/services/main.service'; 
import { Purchases } from 'src/app/purchases';

@Component({
  selector: 'app-erp',
  templateUrl: './erp.component.html',
  styleUrls: ['./erp.component.css']
})
export class ErpComponent{
  lossesShow: boolean = false;
  purchasesShow: boolean = false;
  successShow: boolean = false;
  successText: string;
  
  constructor(private mainService: MainService){}

  toggleLosses(): void{
    this.lossesShow = !this.lossesShow;
  }

  toggleSuccess(): void{
    this.successShow = false;
  }

  togglePurchases(): void{
    this.purchasesShow = !this.purchasesShow;
  }

  AddInfo(data): void{
    this.mainService.addOrder(data).subscribe((res) => {
      if (res) {
        this.successText = 'Order';
        this.successShow = true;
      }
    });
  }

  AddLosses(data): void{
    this.mainService.addLosses(data).subscribe((res) => {
      if (res) {
        this.successText = 'Losses';
        this.successShow = true;
      }
    });
  }

  addPurchases(data: FormData): void {
    this.mainService.addPurchases(data).subscribe((res) => {
      if (res) {
        this.successText = 'Bulk Purchases';
        this.successShow = true;
      }
    });
  }
}
