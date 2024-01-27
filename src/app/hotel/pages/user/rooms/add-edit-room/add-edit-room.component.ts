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
import { Room } from '../../../../interfaces/room-interface';
import { PrimeNgModule } from '../../../../components/prime-ng/prime-ng.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RoomsService } from '../../../../services/rooms.service';
import { RoomStatus, RoomsType } from '../../../../interfaces/roomType-interface';
import { Hotel } from '../../../../interfaces/hotel-interface';
import { RoomTypeService } from '../../../../services/room-type.service';
import { HotelService } from '../../../../services/hotel.service';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'hotel-add-edit-room',
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule],
  templateUrl: './add-edit-room.component.html',
  styleUrl: './add-edit-room.component.css',
})
export class AddEditRoomComponent implements OnInit, OnChanges {
  private roomService = inject(RoomsService);

  private hotelService = inject(HotelService);

  private roomTypeService = inject(RoomTypeService);

  private messageService = inject(MessageService);

  private fb = inject(FormBuilder);

  @Input()
  public displayAddEditModal: boolean = true;

  @Input()
  public selectedRoom!: Room | null;

  @Output()
  public clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public clickAddEditSave: EventEmitter<Room> = new EventEmitter<Room>();

  public roomTypes: RoomsType[] = [];

  public hotels: Hotel[] = [];

  public formRoom: FormGroup = this.fb.group({
    roomNumber: [0, Validators.required],
    price: [0, Validators.required],
    capacity: [0, Validators.required],
    // status: [0, Validators.required],
    roomType: [0, Validators.required],
    hotel:[0, Validators.required],
  });

  ngOnInit(): void {
    this.loadsRoomTypesAndHotels();
  }

  ngOnChanges(): void {
    if (this.selectedRoom) {
      this.formRoom.patchValue(this.selectedRoom);
    console.log(this.selectedRoom);
    } else {
      this.formRoom.reset();
    }
  }

  async loadsRoomTypesAndHotels(): Promise<any> {
    let hotels = await firstValueFrom(this.hotelService.getHotels());
    let roomTypes = await firstValueFrom(this.roomTypeService.getRoomsTypes());

    try {
      if (hotels.length > 0 && roomTypes.length > 0) {
        this.hotels = hotels;
        this.roomTypes = roomTypes;
      }
    } catch (e: HttpErrorResponse | any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Server internal error',
        detail: e.message,
        life: 3000,
      });
    }
  }

  closeModal(): void {
    this.formRoom.reset();
    this.clickClose.emit(true);
  }

  addEditRoom(): void {
    const currentRoom = {...this.formRoom.value};
    if(!this.selectedRoom){
      this.roomService.saveRoom(currentRoom).subscribe({
        next:() =>{
          this.messageService.add({
            severity: 'success',
            summary: 'Room updated',
            detail: 'Room updated successfully',
            life: 3000,
          });
          this.clickAddEditSave.emit(currentRoom);
          this.closeModal();
        }
      })
    }else{
      this.roomService.updateRoom(currentRoom,this.selectedRoom.id!).subscribe({
        next:() =>{
          this.messageService.add({
            severity: 'success',
            summary: 'Room updated',
            detail: 'Room updated successfully',
            life: 3000,
          });
          this.clickAddEditSave.emit(currentRoom);
          this.closeModal();
        }
      })
    }

  }
}
