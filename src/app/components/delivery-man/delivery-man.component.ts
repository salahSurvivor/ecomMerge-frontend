import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { UserServiceService } from '../users/services/user-service.service';
import { users } from '../users/user';


@Component({
  selector: 'app-delivery-man',
  templateUrl: './delivery-man.component.html',
  styleUrls: ['./delivery-man.component.css']
})
export class DeliveryManComponent implements OnInit {
  deliveryMen: any[] = [];
  deliveryMan: any = {};
  editing: boolean = false;
  currentId: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  successShow: boolean = false;

  constructor(private deliveryManService: MainService, private userService: UserServiceService,
      private mainService: MainService
  ) {}

  ngOnInit(): void {
    this.loadDeliveryMen();
  }

  loadDeliveryMen() {
    this.userService.onRead().subscribe(
      (data) => {
        this.deliveryMen = data;
      },
      (error) => {
        this.errorMessage = error.error || 'Failed to load delivery men.';
      }
    );
  }

  createDeliveryMan() {
    this.deliveryMan.isDeliveryMan = true;
    this.deliveryMan.isAdmin = false;
    this.deliveryMan.name = this.mainService.getUsername();
    console.log('this.deliveryMan: ', this.deliveryMan);
    this.userService.onRegister(this.deliveryMan).subscribe(
      () => {
        this.loadDeliveryMen();
        this.deliveryMan = {};
        this.successMessage = 'Delivery man added successfully!';
        this.successShow = true;
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = error.error || 'Failed to create delivery man.';
      }
    );
  }

  editDeliveryMan(deliveryMan: any) {
    this.deliveryMan = { ...deliveryMan }; // Copy the delivery man details to the form
    this.editing = true; // Set editing state to true
    this.currentId = deliveryMan._id; // Store the current ID for updates
  }

  updateDeliveryMan() {
    this.userService.onUpdate(this.deliveryMan).subscribe(
      () => {
        this.loadDeliveryMen();
        this.editing = false;
        this.deliveryMan = {};
        this.successMessage = 'Delivery man updated successfully!';
        this.successShow = true;
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = error.error || 'Failed to update delivery man.';
      }
    );
  }

  deleteDeliveryMan(id: string) {
    this.userService.onDelete(id).subscribe(
      () => {
        this.loadDeliveryMen();
        this.successMessage = 'Delivery man deleted successfully!';
        this.successShow = true;
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = error.error || 'Failed to delete delivery man.';
      }
    );
  }

  cancelEdit() {
    this.editing = false;
    this.deliveryMan = {};
    this.successMessage = '';
    this.errorMessage = '';
  }

  toggleSuccess() {
    this.successShow = false; // Hide success alert
  }
}