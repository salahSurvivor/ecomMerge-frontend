import { Injectable } from '@angular/core';
import { Pcinfo } from '../pcinfo';
import { Losses } from '../losses';
import { Store } from '../Models/store.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Purchases } from '../purchases';
import { LandingPage } from '../landingPage';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})

export class MainService {
  private readonly baseUrl = environment.apiUrl; // ✅ baseUrl configurable
  private apiUrl = `${this.baseUrl}/orders/`;
  private mainBaseUrl=`${this.baseUrl}`
  private apiUrlLosses = `${this.baseUrl}/losses/`;
  private Url = `${this.baseUrl}/purchases/`;
  private storeApi = `${this.baseUrl}/store/`;
  private lpApi = `${this.baseUrl}/getLink/`;

  constructor(
    private http: HttpClient,
    private jwt: JwtHelperService,
  ) {}

   //#region Orders
  getUsername(){
    const token = this.jwt.decodeToken(localStorage.getItem('token'));
    return token?.name || '';
  }

   getOrders2(){
    let params = { sCode: this.getUsername() };
    return this.http.get<Pcinfo[]>(this.apiUrl, { params });
  }

  getOrders(): Observable<Pcinfo[]>{
    let params = { sCode: this.getUsername() };
    return this.http.get<Pcinfo[]>(this.apiUrl, { params });
  }

  addOrder(data: Pcinfo): Observable<Pcinfo>{
    return this.http.post<Pcinfo>(this.apiUrl, data);
  }

  getOrdersProfits(): Observable<any>{
    let params = { sCode: this.getUsername() };
    return this.http.get<any>(`${this.baseUrl}/ordersProfits/`, { params });
  }

  updatePurchase(pcinfo: Pcinfo, nb): Observable<Pcinfo>{
    return this.http.put<Pcinfo>(this.apiUrl+ nb, pcinfo, httpOptions);
  }

  getDataForDelivery(): Observable<Pcinfo[]>{
    let params = { sCode: this.getUsername() };
    return this.http.get<Pcinfo[]>(`${this.baseUrl}/getDataForDelivery/`, { params });
  }
  //#endregion Orders

  //#region Losses
  getLosses(): Observable<Losses[]>{
    let params = { sCode: this.getUsername() };
    return this.http.get<Losses[]>(this.apiUrlLosses, { params });
  }

  addLosses(data: Losses): Observable<Losses>{
    return this.http.post<Losses>(this.apiUrlLosses, data);
  }  

  deleteLosses(nb: number): Observable<Losses>{
    return this.http.delete<Losses>(this.apiUrlLosses+ nb);
  }
  //#endregion Losses

  //#region Purchases
  getPurchases(): Observable<Purchases[]>{
    let params = { sCode: this.getUsername() };
    return this.http.get<Purchases[]>(this.Url, { params });
  }

  getLandingPage(): Observable<LandingPage[]>{
    let params = { sCode: this.getUsername() };
    return this.http.get<LandingPage[]>(this.lpApi, { params });
  }

  addPurchases(data: FormData): Observable<any> {
    //data.societeCode = this.getUsername();
    return this.http.post<any>(this.Url, data);
  }

  deletePurchase(nb: number): Observable<Purchases>{
    return this.http.delete<Purchases>(this.Url+ nb);
  }
  //#endregion Purchases

  //#region Store
  getStores(): Observable<Store[]>{
    let params = { sCode: this.getUsername() };
    return this.http.get<Store[]>(this.storeApi, { params });
  }

  addStore(data: Store): Observable<Store>{
    data.societeCode = this.getUsername();
    return this.http.post<Store>(this.storeApi, data);
  }   

  deleteStore(nb: number): Observable<Store>{
    return this.http.delete<Store>(this.storeApi+ nb);
  }
  //#endregion Store
  /////////// delivery man sevice 

  getDeliveryMen(): Observable<any> {
    return this.http.get(this.mainBaseUrl+"/deliverymen");
  }

  createDeliveryMan(deliveryMan: any): Observable<any> {
    return this.http.post(this.mainBaseUrl+"/deliverymen", deliveryMan);
  }

  updateDeliveryMan(id: string, deliveryMan: any): Observable<any> {
    return this.http.put(`${this.mainBaseUrl}/deliverymen/${id}`, deliveryMan);
  }

  deleteDeliveryMan(id: string): Observable<any> {
    return this.http.delete(`${this.mainBaseUrl}/deliverymen/${id}`);
  }
}
