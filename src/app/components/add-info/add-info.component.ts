import { Component, Output, EventEmitter } from '@angular/core';
import { formatDate } from '@angular/common';
import { Pcinfo } from 'src/app/pcinfo';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-add-info',
  templateUrl: './add-info.component.html',
  styleUrls: ['./add-info.component.css']
})
export class AddInfoComponent {
  currentDate = new Date();
  @Output() addInfo = new EventEmitter();

  name: string;
  date = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
  city: string;
  phone: string;
  purchase: number;
  sale: number;
  quantity: number;
  totalP: number;
  modePayement: string;
  showError: boolean = false;
  username;

  infoForm = new FormGroup({
    name: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('0[567][0-9]{8}')
    ]),
    purchase: new FormControl('', [
      Validators.required,
      Validators.pattern('[1-9]([0-9]?)+(\.[0-9]?)?')
    ]),
    sale: new FormControl('', [
      Validators.required,
      Validators.pattern('[1-9]([0-9]?)+(\.[0-9]?)?')
    ]),
    quantity: new FormControl('', [
      Validators.required,
      Validators.pattern('[1-9]([0-9]?)+(\.[0-9]?)?')
    ]),
    totalP: new FormControl('', [
      Validators.required,
      Validators.pattern('[1-9]([0-9]?)+(\.[0-9]?)?')
    ]),
    modePayement: new FormControl('', Validators.required)
  })

  constructor(
    private jwt: JwtHelperService,
  ){}

  ngOnInit() {
    const token = this.jwt.decodeToken(localStorage.getItem('token'));
    this.username = token.name;
  }

  onSubmit(): void{
    if(Number(this.sale) > Number(this.purchase)){
      this.showError = true;
      return;
    }  

    const data: Pcinfo = {
      name: this.name,
      date: this.date,
      city: this.city,
      phone: this.phone,
      purchasePrice: this.purchase,
      salePrice: this.sale,
      status: 'In progress',
      modePayement: this.modePayement,
      quantity: this.quantity,
      totalP: this.totalP,
      isConfirmed: false,
      societeCode: this.username
    }

    this.addInfo.emit(data);

    this.name = '';
    this.city = '';
    this.phone = '';
    this.purchase = null;
    this.sale = null;

    this.infoForm.reset();
  }

  get Name():  FormControl{
    return this.infoForm.get('name') as FormControl
  }

  get City():  FormControl{
    return this.infoForm.get('city') as FormControl
  }

  get Phone():  FormControl{
    return this.infoForm.get('phone') as FormControl
  }

  get Purchase():  FormControl{
    return this.infoForm.get('purchase') as FormControl
  }

  get Sale():  FormControl{
    return this.infoForm.get('sale') as FormControl
  }

}
