import { Component, Input, Output, EventEmitter } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-add-losses',
  templateUrl: './add-losses.component.html',
  styleUrls: ['./add-losses.component.css']
})
export class AddLossesComponent {
  @Input() lossesShow;
  currentDate = new Date();
  @Output() addLosses = new EventEmitter();

  name: string;
  price: number;
  date =  formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
  username;

  lossesForm = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl('', [ 
      Validators.required,
      Validators.pattern("[1-9]([0-9]?)+(\.[0-9]?)?")
    ])
  });

  constructor(
    private jwt: JwtHelperService,
  ){}

  ngOnInit() {
    const token = this.jwt.decodeToken(localStorage.getItem('token'));
    this.username = token.name;
  }

  OnSubmit(): void{
    const data = {
      name: this.name,
      price: this.price,
      date: this.date,
      societeCode: this.username
    }

    this.addLosses.emit(data);

    this.name = '';
    this.price = null;

    this.lossesForm.reset();
  }

  get Name(): FormControl{
    return this.lossesForm.get('name') as FormControl;
  }

  get Price(): FormControl{
    return this.lossesForm.get('price') as FormControl;
  }
}
