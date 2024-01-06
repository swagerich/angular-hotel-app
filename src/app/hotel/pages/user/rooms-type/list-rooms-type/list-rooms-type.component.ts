import { Component, OnInit, inject } from '@angular/core';
import { PrimeNgModule } from '../../../../components/prime-ng/prime-ng.module';
import { CommonModule } from '@angular/common';
import { RoomsType } from '../../../../interfaces/roomType-interface';
import { RoomTypeService } from '../../../../services/room-type.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AddEditRoomTypeComponent } from '../add-edit-room-type/add-edit-room-type.component';

@Component({
  selector: 'app-list-rooms-type',
  standalone: true,
  imports: [PrimeNgModule,CommonModule,AddEditRoomTypeComponent],
  templateUrl: './list-rooms-type.component.html',
  styleUrl: './list-rooms-type.component.css'
})
export default class ListRoomsTypeComponent implements OnInit {


  private roomTypeService = inject(RoomTypeService);

  private messageService = inject(MessageService);

  private confirmationService = inject(ConfirmationService);

  public selectedRoomType! :RoomsType | null;

  public roomsTypes : RoomsType[] = [];

  public isLoading:boolean = false;

  public displayAddEditModal: boolean = false;


  ngOnInit(): void {
    this.loadRommTypes();
  }

  loadRommTypes(): void {
    this.roomTypeService.getRoomsTypes().subscribe({
      next:(response) =>{
        this.roomsTypes = response
      },
      error:(e:HttpErrorResponse) => {
        this.messageService.add({  severity: 'error',
        summary: 'Successful',
        detail: e.message,
        life: 3000,})
      }
    });
  }


  hideAddModal(event:any):void{
    this.displayAddEditModal = !event;
  }

  showAddModal():void{
    this.displayAddEditModal = true;
    this.selectedRoomType = null;
  }


  saveOrEditList(): void {
    this.loadRommTypes();
  }

  showEditModal(roomType:RoomsType) :void{
    this.displayAddEditModal = true;
    this.selectedRoomType = roomType;
  }

  getSeverity(roomType:RoomsType) : string | undefined{
    return undefined;
  }
}
