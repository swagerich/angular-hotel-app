import { Component, OnInit, inject } from '@angular/core';
import { PrimeNgModule } from '../../../../components/prime-ng/prime-ng.module';
import { AddEditBookingComponent } from '../add-edit-booking/add-edit-booking.component';
import { BookingsService } from '../../../../services/bookings.service';
import { BookingDto } from '../../../../proyection/bookingDto-interface';

@Component({
  selector: 'app-list-bookings',
  standalone: true,
  imports: [PrimeNgModule,AddEditBookingComponent],
  templateUrl: './list-bookings.component.html',
  styleUrl: './list-bookings.component.css'
})
export default class ListBookingsComponent implements OnInit {

  private bookingsService = inject(BookingsService);

  public isLoading: boolean = false;

  public bookings: BookingDto[] = [];

  public selectedBooking: any;

  public displayAddEditModal: boolean = false;


  ngOnInit(): void {
   this.loadBookings();
  }

  loadBookings(): void {
    this.bookingsService.getBookings().subscribe({
      next: (response) => {
        this.bookings = response;
        console.log(this.bookings);
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  showAddModal(): void {
    this.displayAddEditModal = true;
  }

  hideAddModal(event:any): void {
    this.displayAddEditModal = !event;
  }
  saveOrEditList(): void {

  }
  showEditModal(booking:any): void {

  }
}
