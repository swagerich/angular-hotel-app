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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimeNgModule } from '../../../../components/prime-ng/prime-ng.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Client } from '../../../../interfaces/client-interface';
import { ClientsService } from '../../../../services/clients.service';
@Component({
  selector: 'hotel-edit-add-client',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeNgModule],
  templateUrl: './add-edit-client.component.html',
  styleUrl: './add-edit-client.component.css',
})
export default class AddEditClientComponent implements OnChanges {
 
  private fb = inject(FormBuilder);

  private clientsService = inject(ClientsService);

  private messageService = inject(MessageService);

  @Input()
  public displayAddEditModal: boolean = true;

  @Input()
  public selectedClient! : Client | null;

  @Output()
  public clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public clickAddEditSave: EventEmitter<Client> = new EventEmitter<Client>();

  public clientsForms = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.required],
    gender: ['', Validators.required],
    dni: ['', Validators.required],
    category: ['', Validators.required],
  });

  public categories = ['Adult', 'Child', 'Junior', 'Senior', 'Student'];

  public genders = ['Male', 'Female'];

  ngOnChanges(): void {
    if(this.selectedClient){
      this.clientsForms.patchValue(this.selectedClient);
    }else{
      this.clientsForms.reset();
    }
  }

  get currentClient(): Client {
    return this.clientsForms.value as Client;
  }

  closeModal(): void {
    this.clientsForms.reset();
    this.clickClose.emit(true);
  }

  addEditClient(): void {
    if(!this.selectedClient){
      this.clientsService.saveClient(this.currentClient).subscribe((data) => {
        this.clickAddEditSave.emit(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Client Created',
          life: 3000,
        });
        this.closeModal();
      });
    }else{
      this.clientsService.updateClient(this.currentClient,this.selectedClient.id).subscribe((data) => {
        this.clickAddEditSave.emit(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Client Updated',
          life: 3000,
        });
        this.closeModal();
      });
    }
   
  }
}
