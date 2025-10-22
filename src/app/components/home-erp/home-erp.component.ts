import { Component } from '@angular/core';

@Component({
  selector: 'app-home-erp',
  templateUrl: './home-erp.component.html',
  styleUrls: ['./home-erp.component.css']
})
export class HomeErpComponent {
  search: any;
  date: string;
  dt: string;
  endDate: Date;
  statusList = [ 
    { libelle: 'Delivered' },
    { libelle: 'Confirmed' },
    { libelle: 'Canceled' },
  ];
  selectedStatus: string;

  clear(): void{
    this.date = null;
    this.endDate = null;
    this.selectedStatus = null;
    this.dt = 'clear';
  }

  filter(): void{
    this.dt = this.date;
  }
}
