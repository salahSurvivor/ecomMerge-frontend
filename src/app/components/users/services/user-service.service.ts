import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { users } from '../user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private readonly apiUrl = `${environment.apiUrl}/`;

  constructor(private http: HttpClient, private jwt: JwtHelperService,) { }

  getUsername(){
    const token = this.jwt.decodeToken(localStorage.getItem('token'));
    return token?.name || '';
  }

  /****************Read-users********************/
  onRead(): Observable<users[]>{
    let params = { sCode: this.getUsername() };
    return this.http.get<users[]>(this.apiUrl + 'users', { params });
  }

  /****************Register********************/
  onRegister(data): Observable<users>{
    console.log('data: ', data);
    return this.http.post<users>(this.apiUrl+ 'register', data);
  } 

  /****************Update-users********************/
  onUpdate(data): Observable<users>{
    return this.http.put<users>(this.apiUrl + 'users/'+ data._id, data);
  }

  /****************Delete-users********************/
  onDelete(id): Observable<users>{
    return this.http.delete<users>(this.apiUrl + 'users/'+ id);
  }
}
