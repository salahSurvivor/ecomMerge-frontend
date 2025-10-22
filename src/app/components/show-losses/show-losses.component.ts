import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { Losses } from 'src/app/losses';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-show-losses',
  templateUrl: './show-losses.component.html',
  styleUrls: ['./show-losses.component.css']
})
export class ShowLossesComponent implements OnChanges {
  losses: Losses[] = [];

  @Input() ls: string;
  @Output() dltL = new EventEmitter();

  p: number = 1;
  count: number = 5;
  id: number;

  price: number;

  constructor(private mainService: MainService){}

  ngOnInit(): void{
    this.getLossesList();
  }

  getLossesList() {
    this.mainService.getLosses().subscribe((losses) => {
      this.losses = losses;
    });
  }

  ngOnChanges(): void{
    if(this.ls == 'clear'){
      this.ngOnInit();
      return;
    }

    if (!this.ls) { return; }

    this.mainService.getLosses().subscribe((items) => 
      this.losses = items.filter((i) => 
        formatDate(new Date(i.date), 'MM/dd/yyyy', 'en-US') == formatDate(new Date(this.ls), 'MM/dd/yyyy', 'en-US')
    ));
  }

  deleteLosses(){
    this.mainService.deleteLosses(this.id).subscribe((res) => {
      if (res)
        this.losses = this.losses.filter((value) => value._id !== this.id)
    });
    this.dltL.emit();
  }

  getId(nb, price){
    this.price = price;
    this.id = nb;
  }
}
