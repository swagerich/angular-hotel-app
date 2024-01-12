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
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Room } from '../../../../interfaces/room-interface';
import { ClientDto } from '../../../../proyection/clientDto-interface';
import { ClientsService } from '../../../../services/clients.service';
import { RoomsService } from '../../../../services/rooms.service';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { BookingsService } from '../../../../services/bookings.service';

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
  public selectedBooking: any;

  @Input()
  public displayAddEditModal: boolean = true;

  @Output()
  public clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public clickAddEditSave: EventEmitter<any> = new EventEmitter<any>();

  //por ahora estoy usando el clientDto de la proyeccion (mas luego voy a probar de la entidad)
  public clients: ClientDto[] = [];

  public rooms: Room[] = [];

  public formBooking: FormGroup = this.fb.group({
    checkInDate: [''],
    checkOutDate: [''],
    client: [''],
    room: [''],
  });

  ngOnInit(): void {
    this.loadClientsAndRooms();
  }

  ngOnChanges(): void {}

  async loadClientsAndRooms(): Promise<any> {
    let clients = await firstValueFrom(this.clientsService.getClients());
    let rooms = await firstValueFrom(this.roomService.getRooms());
    try {
      if (clients.length > 0 && rooms.length > 0) {
        this.clients = clients;
        this.rooms = rooms;
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
    }

  }

  private convertDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).split('/').join('-');

  }
}
