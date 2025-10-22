import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GuardService } from './services/guard.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard {

    
    constructor(private userService: GuardService , private router: Router) {}

    canActivate(): boolean {
    if(this.userService.isAdmin()){
      return true;
    }
    else{
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
