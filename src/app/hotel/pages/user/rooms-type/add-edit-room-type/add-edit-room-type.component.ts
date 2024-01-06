import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { PrimeNgModule } from '../../../../components/prime-ng/prime-ng.module';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoomsType } from '../../../../interfaces/roomType-interface';
import { MessageService } from 'primeng/api';
import { RoomTypeService } from '../../../../services/room-type.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'hotel-add-edit-room-type',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeNgModule],
  templateUrl: './add-edit-room-type.component.html',
  styleUrl: './add-edit-room-type.component.css'
})
export class AddEditRoomTypeComponent implements OnChanges {

  private roomTypeService = inject(RoomTypeService);

  private messageService = inject(MessageService);

  private fb = inject(FormBuilder);

  @Output()
  public clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public clickAddEditSave: EventEmitter<RoomsType> = new EventEmitter<RoomsType>();

  @Input()
  public selectedRoomType! : RoomsType | null;

  @Input()
  public displayAddEditModal: boolean = true;

  public formRoomType = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required]
  });

  ngOnChanges(): void {
    if(this.selectedRoomType){
      this.formRoomType.patchValue(this.selectedRoomType);
    }else{
      this.formRoomType.reset();
    }
  }

  get currentRoomType(): RoomsType {
    return this.formRoomType.value as RoomsType;
  }

  closeModal(): void {
    this.formRoomType.reset();
    this.clickClose.emit(true);
  }

  addEditRoomType():void{
    if(!this.selectedRoomType){
      this.roomTypeService.saveRoomType(this.currentRoomType).subscribe({
        next:(data)=>{
          this.closeModal();
          this.clickAddEditSave.emit(data);
          this.messageService.add({  severity: 'success',
          summary: 'Successful',
          detail: 'Room type created',
          life: 3000,})
        },
        error:(e:HttpErrorResponse) =>{
          this.messageService.add({  severity: 'error',
          summary: 'Oops!',
          detail: e.message,
          life: 3000,})
        }
      })
    }else{
      this.roomTypeService.updateRoomType(this.currentRoomType,this.selectedRoomType.id).subscribe({
        next:(data)=>{
          this.closeModal();
          this.clickAddEditSave.emit(data);
          this.messageService.add({  severity: 'success',
          summary: 'Successful',
          detail: 'Room type updated',
          life: 3000,})
        },
        error:(e:HttpErrorResponse) =>{
          this.messageService.add({  severity: 'error',
          summary: 'Oops!',
          detail: e.message,
          life: 3000,})
        }
      })
    }
  }
}
