import { Component } from '@angular/core';
import { count } from 'rxjs';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent {

  stores;
  newStore = { name: '', description: '', category: '' };
  successText;
  successShow;
  storeId;
  productList;
  landingPage;
  selectedStoreId;

  constructor(private mainService: MainService) {}

  ngOnInit() {
    this.getStores();
    this.getProductList();
    this.getLandingPage();
  }

  getStores(): void {
    this.mainService.getStores().subscribe(res => this.stores = res)
  }
  
  addStore(): void{
    this.mainService.addStore(this.newStore).subscribe((res) => {
      if (res) {
        this.successText = 'Store';
        this.successShow = true; 
        this.stores.push({ ...this.newStore });
        this.newStore = { name: '', description: '', category: '' };

        // Fermer la modal via jQuery Bootstrap
        document.getElementById('confirm-modaldismiss1').click();
      }
    });
  }

  toggleSuccess(): void{
    this.successShow = false;
  }

  onDeleteClick(store) {
    this.storeId = store?._id;
  }

  delete() {
    this.mainService.deleteStore(this.storeId).subscribe(res => {
      if (res) {
        this.stores = this.stores.filter(vl => vl._id !== this.storeId);
      }
    })
  }

  getProductList() {
    this.mainService.getPurchases().subscribe(vl => this.productList = vl);
  }

  getLandingPage() {
    this.mainService.getLandingPage().subscribe(res => this.landingPage = res)
  }

  get filteredProducts() {
    if (!this.selectedStoreId) { return null; }
    return this.productList.filter(p => p.storeId === this.selectedStoreId);
  }
  
  filteredLandingPage(prId) {
    return this.landingPage.filter(vl => vl.p_id === prId);
  }

  onChangeStoreId(storeId) {
    //console.log('storeId: ', storeId);
    this.selectedStoreId = storeId;
  }
}
