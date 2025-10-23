import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { MessageService } from 'primeng/api';
import { users } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  onLoad: boolean = false;

  constructor(private userService: UserServiceService, 
              private messageService: MessageService){}

  onSubmit(): void{
    this.onLoad = true;

    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      isAdmin: true
    }
    
    this.userService.onRegister(data).subscribe(
      () => {
        this.onLoad = false;

        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Register With Success!!' });
      },
      (err) =>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error });
      }
    );

    this.name = null;
    this.email = null;
    this.password = null;
    this.isAdmin = null;  
  }
}
