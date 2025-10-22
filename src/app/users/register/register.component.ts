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

  constructor(private userService: UserServiceService, 
              private messageService: MessageService){}

  onSubmit(): void{
    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      isAdmin: false
    }
    
    this.userService.onRegister(data).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Register With Success!!' });
      },
      (err) =>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error });
      }
    );


    //this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Register With Success!!' });


    this.name = null;
    this.email = null;
    this.password = null;
    this.isAdmin = null;  
  }
}
