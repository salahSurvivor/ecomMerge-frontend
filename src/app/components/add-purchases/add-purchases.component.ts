import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-add-purchases',
  templateUrl: './add-purchases.component.html',
  styleUrls: ['./add-purchases.component.css']
})
export class AddPurchasesComponent implements OnInit {
  @Input() purchasesShow!: boolean;
  @Output() addP = new EventEmitter<FormData>();
  purchasesForm!: FormGroup;
  username;

  imgFiles: { [key: string]: File | null } = {
    img1_P: null,
    img2_P: null,
    img3_P: null
  };

  selectedStore;
  storeList;

  constructor(private fb: FormBuilder, private jwt: JwtHelperService, private mainService: MainService) {}

  ngOnInit(): void {
    const token = this.jwt.decodeToken(localStorage.getItem('token'));
    this.username = token.name;
    this.getStores();
  
    this.purchasesForm = this.fb.group({
      nameP: ['', Validators.required],
      titleP: ['', Validators.required],
      descriP: ['', Validators.required],
      feature1_P: [''],
      feature2_P: [''],
      feature3_P: [''],
      quantityP: ['', [Validators.required, Validators.min(1)]],
      purchasePrice: ['', [Validators.required, Validators.min(0)]],
      salePrice: ['', [Validators.min(0)]],
      stores: ['', Validators.required]
    });
  }

  getStores(): void {
    this.mainService.getStores().subscribe(res => this.storeList = res)
  }

  onFileChange(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      this.imgFiles[field] = file;
    }
  }

  onSubmit(): void {
    if (this.purchasesForm.invalid) return;

    const formValue = this.purchasesForm.value;
    const formData = new FormData();
    const totalPrice = parseFloat(formValue.purchasePrice) *  parseFloat(formValue.quantityP);

    formData.append('productName', formValue.nameP);
    formData.append('productTitle', formValue.titleP);
    formData.append('productDescription', formValue.descriP);
    formData.append('productFeature1', formValue.feature1_P);
    formData.append('productFeature2', formValue.feature2_P);
    formData.append('productFeature3', formValue.feature3_P);
    formData.append('productquantity', formValue.quantityP);
    formData.append('purchasePrice', formValue.purchasePrice);
    formData.append('salePrice', formValue.salePrice);
    formData.append('societeCode', this.username);
    formData.append('totalP', totalPrice.toString());
    formData.append('storeId', this.selectedStore._id);

    formData.append('productImg1', this.imgFiles['img1_P'] as File);
    formData.append('productImg2', this.imgFiles['img2_P'] as File);
    formData.append('productImg3', this.imgFiles['img3_P'] as File);

    this.addP.emit(formData);

    this.purchasesForm.reset();
    this.imgFiles = {
      img1_P: null,
      img2_P: null,
      img3_P: null
    };
  }
}
