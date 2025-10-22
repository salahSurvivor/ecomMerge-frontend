import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { users } from '../user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private readonly baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/`; // ✅ baseUrl configurable

  constructor(private http: HttpClient) { }

  /****************Read-users********************/
  onRead(): Observable<users[]>{
    return this.http.get<users[]>(this.apiUrl + 'users');
  }

  /****************Register********************/
  onRegister(data): Observable<users>{
    return this.http.post<users>(this.apiUrl+ 'register', data);
  } 

  /****************Update-users********************/
  onUpdate(data): Observable<users>{
    return this.http.put<users>(this.apiUrl + 'users/'+ data._id, data);
  }

  /****************Delete-users********************/
  onDelete(data): Observable<users>{
    return this.http.delete<users>(this.apiUrl + 'users/'+ data._id);
  }
}
