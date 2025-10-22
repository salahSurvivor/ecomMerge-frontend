import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/users/services/user-service.service';
import { users } from 'src/app/users/user';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GuardService {
    private apiUrl = `${environment.apiUrl}/`;
  items: any;
  admin2: boolean = false;
  adminId : users[];

  constructor(
    private readonly http: HttpClient,
    private readonly jwtHelper: JwtHelperService,
    private userService: UserServiceService
  ){
    this.userService.onRead()
      .subscribe((vl) => this.adminId = vl.filter((value) => value.isAdmin === true))
  }

  login(data){
    return this.http.post<{token : string}>(this.apiUrl + 'login', data);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  isAdmin(): boolean{
    const decodeToken = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    return decodeToken.isAdmin;
  }

  isDeliveryMan(): boolean{
    const decodeToken = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    return decodeToken.isDeliveryMan;
  }

  getDeliveryManId(): string {
    const decodeToken = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    return decodeToken.id;
  }

}
