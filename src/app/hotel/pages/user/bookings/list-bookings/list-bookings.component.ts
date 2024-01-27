import { Component, OnInit, inject } from '@angular/core';
import { PrimeNgModule } from '../../../../components/prime-ng/prime-ng.module';
import { AddEditBookingComponent } from '../add-edit-booking/add-edit-booking.component';
import { BookingsService } from '../../../../services/bookings.service';
import { BookingDto } from '../../../../proyection/bookingDto-interface';
import { Booking } from '../../../../interfaces/booking-interface';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-list-bookings',
  standalone: true,
  imports: [PrimeNgModule,AddEditBookingComponent],
  templateUrl: './list-bookings.component.html',
  styleUrl: './list-bookings.component.css'
})
export default class ListBookingsComponent implements OnInit {

  private messageService = inject(MessageService);

  private confirmationService = inject(ConfirmationService);

  private bookingsService = inject(BookingsService);

  public isLoading: boolean = false;

  public bookings: BookingDto[] = [];

  public selectedBooking!: BookingDto | null;

  public displayAddEditModal: boolean = false;


  ngOnInit(): void {
   this.loadBookings();
  }

  loadBookings(): void {
    this.bookingsService.getBookings().subscribe({
      next: (response) => {
        this.bookings = response;
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  showAddModal(): void {
    this.displayAddEditModal = true;
    this.selectedBooking = null;
  }

  hideAddModal(event:any): void {
    this.displayAddEditModal = !event;
  }

  saveOrEditList(): void {

  }
  
  showEditModal(booking:BookingDto): void {
    this.selectedBooking = booking;
    this.displayAddEditModal = true;
  }

  deleteBooking(booking:BookingDto): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + booking.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
    this.bookingsService.deleteBooking(booking.id!).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Booking Deleted',
          life: 3000,
        });
        this.loadBookings();
      },
      error: (error) => {
        console.log(error);
      },
    })
  },
});
  }
}
