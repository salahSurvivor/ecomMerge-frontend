import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { GuardService } from 'src/app/guards/services/guard.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  username;
  isAdmin;
  isDeliveryMan;

  constructor(
    private jwt: JwtHelperService,
    private readonly authService: GuardService,
  ){}

  ngOnInit(){
    const token = this.jwt.decodeToken(localStorage.getItem('token'));
    this.username = token.name;
    this.isAdmin = this.authService.isAdmin();
    this.isDeliveryMan = token.isDeliveryMan;
    if (this.isDeliveryMan)
      this.username = token.userName;
  }

  logOut(){
    this.authService.logout();
  }

}
