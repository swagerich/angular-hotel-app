import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { PrimeNgModule } from '../../../../components/prime-ng/prime-ng.module';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';

import { Room } from '../../../../interfaces/room-interface';
import { ClientDto } from '../../../../proyection/clientDto-interface';
import { ClientsService } from '../../../../services/clients.service';
import { RoomsService } from '../../../../services/rooms.service';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { BookingsService } from '../../../../services/bookings.service';
import { Booking } from '../../../../interfaces/booking-interface';
import { BookingDto } from '../../../../proyection/bookingDto-interface';

@Component({
  selector: 'hotel-add-edit-booking',
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule],
  templateUrl: './add-edit-booking.component.html',
  styleUrl: './add-edit-booking.component.css',
})
export class AddEditBookingComponent implements OnChanges, OnInit {


  private bookingsService = inject(BookingsService);

  private clientsService = inject(ClientsService);

  private roomService = inject(RoomsService);

  private fb = inject(FormBuilder);

  @Input()
  public selectedBooking!: BookingDto  | null;

  @Input()
  public displayAddEditModal: boolean = true;

  @Output()
  public clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public clickAddEditSave: EventEmitter<Booking> = new EventEmitter<Booking>();

  //por ahora estoy usando el clientDto de la proyeccion (mas luego voy a probar de la entidad)
  public clients: ClientDto[] = [];

  public rooms: Room[] = [];

  public formBooking: FormGroup = this.fb.group({
    checkInDate: ['',Validators.required],
    checkOutDate: ['',Validators.required],
    client: ['',Validators.required],
    room: ['',Validators.required],
  },{validator: this.isDateValid()});


  ngOnInit(): void {
    this.loadClientsAndRooms();
  }

  /**
   * 
   * OJO AQUI NO ME SETEA LOS VALORES AL FORMULARIO CUANDO SE EDITA
   */
  ngOnChanges(): void {
    if(this.selectedBooking ){
      // const checkInDate = this.convertDate(this.selectedBooking.checkInDate);
      // const checkOutDate = this.convertDate(this.selectedBooking.checkOutDate);
      this.formBooking.patchValue({
        checkInDate: this.selectedBooking.checkInDate,
        checkOutDate: this.selectedBooking.checkOutDate,
      });
    }else{
       this.formBooking.reset();
    }
  }

  async loadClientsAndRooms(): Promise<any> {
    let clients = await firstValueFrom(this.clientsService.getClients());
    let rooms = await firstValueFrom(this.roomService.getRooms());
    try {
      if (clients.length > 0 && rooms.length > 0) {
      let roomsActive = rooms.filter((room) => room.status === 'AVAILABLE');
        this.clients = clients;
        this.rooms = roomsActive;
      }
    } catch (error: HttpErrorResponse | any) {
      console.log(error.message);
    }
  }

  closeModal(): void {
    this.formBooking.reset();
    this.clickClose.emit(true);
  }

  addEditRoom(): void {
    const checkInDate = this.formBooking.get('checkInDate')?.value;
    const checkOutDate = this.formBooking.get('checkOutDate')?.value;

     let formattedCheckInDate =  this.convertDate(checkInDate);
     let formattedCheckOutDate =  this.convertDate(checkOutDate);

    this.formBooking.get('checkInDate')?.setValue(formattedCheckInDate);
    this.formBooking.get('checkOutDate')?.setValue(formattedCheckOutDate);
     
    const currentBooking = {...this.formBooking.value};

    if(!this.selectedBooking){
      this.bookingsService.saveBooking(currentBooking).subscribe({
        next: (booking) => {
          this.clickAddEditSave.emit(booking);
          this.closeModal();
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.message);
        },
      })
    }else{
      console.log(this.formBooking.value);
    }
  }

  isDateValid(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const checkInDate = group.get('checkInDate')?.value;
      const checkOutDate = group.get('checkOutDate')?.value;

      if (checkInDate && checkOutDate && checkInDate > checkOutDate) {
        return { 'dateComparison': true }; 
      } 
       return null;
      
    };
  }

  private convertDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).split('/').join('-');
  }
}
