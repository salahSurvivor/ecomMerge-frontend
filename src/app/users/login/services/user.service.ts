import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserServiceService } from '../../services/user-service.service';
import { users } from '../../user';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {
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
    return this.http.post<{ token: string }>(this.apiUrl + 'login', data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('numero');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  isAdmin(data){
    this.adminId.map((vl) => {
      if(vl.name === data.name){}
        //localStorage.setItem('admin', 'true');
    });
  }

}
