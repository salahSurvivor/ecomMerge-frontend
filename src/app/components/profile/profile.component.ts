import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
declare var window: any; // For using Bootstrap modal JS API

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private readonly baseUrl = environment.apiUrl; // ✅ baseUrl configurable

  username: string | undefined;
  isAdmin: boolean | false;
  email: string | undefined;
  phone: string | undefined;
  address: string | undefined;
  id: string | undefined;

  editUsername: string = '';
  editEmail: string = '';
  editPhone: string = '';
  editAddress: string = '';
  editPassword: string = '';

  constructor(private jwtHelper: JwtHelperService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  private getUserInfo(): void {
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log(decodedToken)
      this.username = decodedToken.isDeliveryMan ? decodedToken.userName : decodedToken.name;
      this.email = decodedToken.email;
      this.phone = decodedToken.phone;
      this.address = decodedToken.Address;
      this.id = decodedToken.id;
    } else {
      console.error('Token is invalid or expired');
    }
  }

  openEditModal(): void {
    this.editUsername = this.username || '';
    this.editEmail = this.email || '';
    this.editPhone = this.phone || '';
    this.editAddress = this.address || '';
    this.editPassword = '';

    const editModal = new window.bootstrap.Modal(document.getElementById('editProfileModal'));
    editModal.show();
  }

  updateProfile(): void {
    if (!this.id) {
      console.error('User ID not found');
      return;
    }

    const updatePayload: any = {
      name: this.editUsername,
      email: this.editEmail,
      phone: this.editPhone,
      Address: this.editAddress
    };

    if (this.editPassword && this.editPassword.trim() !== '') {
      updatePayload.password = this.editPassword;
    }
    
    this.http.put(`${this.baseUrl}/users/${this.id}`, updatePayload).subscribe({
      next: (res) => {
        console.log('Profile updated successfully');
        alert('Profile updated successfully!');
        // Update local fields
        this.username = this.editUsername;
        this.email = this.editEmail;
        this.phone = this.editPhone;
        this.address = this.editAddress;
        // Close modal
        const editModal = window.bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
        editModal.hide();
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        alert('Failed to update profile');
      }
    });
  }
}
