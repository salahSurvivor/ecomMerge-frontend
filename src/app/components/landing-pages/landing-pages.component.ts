import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MainService } from 'src/app/services/main.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-landing-pages',
  templateUrl: './landing-pages.component.html',
  styleUrls: ['./landing-pages.component.css']
})
export class LandingPagesComponent implements OnInit {
  private readonly baseUrl = environment.apiUrl;

  templates: any[] = [];
  safeUrls: { [key: string]: SafeResourceUrl } = {};
  selectedTemplate: any = null;

  customTitle = '';
  customLogo = '';
  productImages: string[] = [];
  storeName = '';

  productList: any[] = [];
  selectedProduct: any;

  PaymentModeList = ["Paypal", "Visa Card", "Cash On Delivery"];
  selectedPaymentModes: string[] = []; 

  landingForm: FormGroup;

  selectedStore: any;
  storeList: any;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private jwt: JwtHelperService,
    private mainService: MainService
  ) {
    this.landingForm = this.fb.group({
      p_id : [''],
      lp_Name: ['', Validators.required],
      p_Name: [''],
      title: [''],
      description: [''],
      feature1: [''],
      feature2: [''],
      feature3: [''],
      img1: [''],
      img2: [''],
      img3: [''],
      quantity: [''],
      Price: [''],
      promoPrice: [''],
      totalP: [''],
      dateP: [''],
      storeId: [''],
      dateCreation: [''],
      societeCode: [''],
      storeName: [''],
      selectedPaymentModes: ['']
    });
  }

  ngOnInit(): void {
    this.http.get<any[]>(`${this.baseUrl}/templates`).subscribe({
      next: (data) => {
        this.templates = data;
        this.templates.forEach(template => {
        const rawUrl = `${this.baseUrl}/back-end/landing_pages_templates/${template.name}/preview.PNG`;
          this.safeUrls[template.name] = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
        });

      },
      error: (err) => {
        console.error('Error fetching templates:', err);
      }
    });

    this.getStores();
  }

  getStores(): void {
    this.mainService.getStores().subscribe(res => this.storeList = res);
  }

  onStoreChange(event: any): void {
    const storeId = event.value._id;
    this.storeName = event.value.name;
    this.productList = [];

    if (storeId) {
      this.mainService.getPurchases().subscribe((purchases) => {
        this.productList = purchases.filter(product => product.storeId === storeId);
      });
    }
  }

  onProductChange(product: any): void {
    this.selectedProduct = product;
  }

  onPaymentModeChange(mode: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement; // Cast de Event à HTMLInputElement

    if (inputElement.checked) {
      // Ajouter le mode de paiement si coché
      this.selectedPaymentModes.push(mode);
    } else {
      // Retirer le mode de paiement s'il est décoché
      const index = this.selectedPaymentModes.indexOf(mode);
      if (index > -1) {
        this.selectedPaymentModes.splice(index, 1);
      }
    }
  }


  selectTemplate(template: any): void {
    this.selectedTemplate = template;
  }

  generateLandingPage(): void {
    if (!this.selectedProduct) {
      alert('Veuillez sélectionner un produit avant de générer la landing page.');
      return;
    }

    if (!this.landingForm.get('lp_Name')?.value) {
      alert('Veuillez entrer un nom pour la landing page.');
      return;
    }

    const product = this.selectedProduct;
    const template = this.selectedTemplate;
    const formData = {
      p_id : product._id,
      lp_Name: this.landingForm.get('lp_Name')?.value,
      p_Name: product.productName,
      title: product.productTitle,
      description: product.productDescription,
      feature1: product.productFeature1,
      feature2: product.productFeature2,
      feature3: product.productFeature3,
      img1: product.productImg1,
      img2: product.productImg2,
      img3: product.productImg3,
      quantity: product.productquantity,
      Price: product.purchasePrice,
      promoPrice: product.salePrice,
      totalP: product.totalP,
      dateP: new Date().toISOString().slice(0, 10),
      storeId: product.storeId,
      dateCreation: new Date().toISOString().slice(0, 10),
      societeCode: product.societeCode,
      templateName: template.name,
      storeName: this.storeName,
      selectedPaymentModes: this.selectedPaymentModes
    };

    this.http.post(`${this.baseUrl}/landing-pages/generate`, formData).subscribe(
      (res: any) => {
        alert('Landing page generated successfully!');
        const landingPageUrl = `${res.url}`;
        window.open(landingPageUrl, '_blank'); // Open in a new tab
      },
      err => {
        console.error('Failed to generate landing page:', err);
        alert('Error generating landing page.');
      }
    );
  }
}
