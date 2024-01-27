import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { PrimeNgModule } from '../../../../components/prime-ng/prime-ng.module';
import { Room } from '../../../../interfaces/room-interface';
import { RoomsService } from '../../../../services/rooms.service';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AddEditRoomComponent } from '../add-edit-room/add-edit-room.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RoomStatus } from '../../../../interfaces/roomType-interface';

@Component({
  selector: 'app-list-rooms',
  standalone: true,
  imports: [PrimeNgModule,AddEditRoomComponent],
  templateUrl: './list-rooms.component.html',
  styleUrl: './list-rooms.component.css',
})
export default class ListRoomsComponent implements OnInit {

  private roomService = inject(RoomsService);

  private messageService = inject(MessageService);

  private confirmationService = inject(ConfirmationService);


  public displayAddEditModal: boolean = false;

  public selectedRoom! : Room | null;

  public rooms: Room[] = [];

  public isLoading: boolean = false;



  ngOnInit(): void {
    this.loadRooms();
  }

  async loadRooms(): Promise<any> {
    let rooms = await firstValueFrom(this.roomService.getRooms());
    try {
      if (rooms.length > 0) {
        this.rooms = rooms;
        console.log(   this.rooms)
      }
    } catch (error: HttpErrorResponse | any) {
      console.log(error.message);
    }
  }

  hideAddModal(event:any) : void {
    this.displayAddEditModal = !event;
  }

  saveOrEditList(): void {
    this.loadRooms()
  }

  showAddModal(): void {
    this.displayAddEditModal = true;
    this.selectedRoom = null;
  }

  showEditModal(room: Room): void {
    this.selectedRoom = room;
    this.displayAddEditModal = true;
  }

  getSeverity(room: string): string {
    let  status = room;
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'OCCUPIED':
        return 'danger';
      default:
        return '';
    }
  }

}
