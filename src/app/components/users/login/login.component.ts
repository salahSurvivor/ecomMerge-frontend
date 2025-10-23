import { Component } from '@angular/core';
import { GuardService } from 'src/app/guards/services/guard.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  name: string;
  password: string;
  onLoad: boolean = false;

  constructor(
    private readonly authService: GuardService,
    private messageService: MessageService,
    private router: Router
  ){}

  onLogin():void{
    this.onLoad = true;
    
    const data = {
      name: this.name,
      password: this.password
    }

    this.authService.login(data).subscribe(
      todos => {
        localStorage.setItem('token', todos.token);
        if (this.authService.isAdmin())
          this.router.navigate(['/']);
        else if (this.authService.isDeliveryMan())
          this.router.navigate(['/delivery']);

        this.onLoad = false;
      },
      error =>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message});
        this.onLoad = false;
        this.authService.logout();
      },
    );
  }

}
