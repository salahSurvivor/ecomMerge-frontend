import { Component, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { MainService } from 'src/app/services/main.service';
import { ShowPurchasesComponent } from 'src/app/components/show-purchases/show-purchases.component';
import { ShowLossesComponent } from 'src/app/components/show-losses/show-losses.component';

@Component({
  selector: 'app-losses-purchases',
  templateUrl: './losses-purchases.component.html',
  styleUrls: ['./losses-purchases.component.css']
})
export class LossesPurchasesComponent {
  @ViewChild(ShowPurchasesComponent, { static: false }) showPurchasesComponent: ShowPurchasesComponent;
  @ViewChild(ShowLossesComponent, { static: false }) showLossesComponent: ShowLossesComponent;
  
  losses: string;
  purchases: string;
  ls: string;
  pr: string;
  successShow: boolean = false;
  storageLosses: number = Number(localStorage.getItem('losses'));

   constructor(private mainService: MainService){}

  filter(): void{
    this.ls = this.losses;
    this.pr = this.purchases;
  }

  clear(): void{
    this.losses = null;
    this.purchases = null;
    this.ls = 'clear';
    this.pr = 'clear';
    console.log(this.ls, this.pr);
  }

  toggleSuccess(): void{
    this.successShow = !this.successShow;
  }

  deletePurchase(){
    this.successShow = true;
    this.successText = 'Deleted successfully!';
  }

  deleteLosses(){
    this.successShow = true;
    this.successText = 'Deleted successfully!';
  }

  //#region add losses & productes
  lossesShow: boolean = false;
  purchasesShow: boolean = false;
  //successShow: boolean = false;
  successText: string;
  toggleLosses(): void{
    this.lossesShow = !this.lossesShow;
  }

  togglePurchases(): void{
    this.purchasesShow = !this.purchasesShow;
  }

  AddLosses(data): void{
    this.mainService.addLosses(data).subscribe((res) => {
      if (res) {
        this.showLossesComponent.getLossesList();
        this.successText = 'Losses has been added!';
        this.successShow = true;
        this.toggleLosses();
      }
    });
  }

  addPurchases(data: FormData): void {
    this.mainService.addPurchases(data).subscribe((res) => {
      if (res) {
        this.showPurchasesComponent.getPurchasesList();
        this.successText = 'Bulk Purchases has been added!';
        this.successShow = true;
        this.togglePurchases();
      }
    });
  }

}
