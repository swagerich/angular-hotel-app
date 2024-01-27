import {
  Component,
  OnInit,
  Signal,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';

import { ClientsService } from '../../../../services/clients.service';
import { PrimeNgModule } from '../../../../components/prime-ng/prime-ng.module';
import { ConfirmationService, MessageService } from 'primeng/api';

import AddEditClientComponent from '../add-edit-client/add-edit-client.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ClientDto } from '../../../../proyection/clientDto-interface';
import { Client, ClientStatus } from '../../../../interfaces/client-interface';
import { tap } from 'rxjs';
import { Table } from 'primeng/table';
@Component({
  selector: 'hotel-list-client',
  standalone: true,
  imports: [PrimeNgModule, AddEditClientComponent,CommonModule],
  templateUrl: './list-client.component.html',
  styleUrl: './list-client.component.css'
})
export default class ListClientComponent implements OnInit {
  private clientsService = inject(ClientsService);

  private messageService = inject(MessageService);

  private confirmationService = inject(ConfirmationService);

  public displayAddEditModal = false;

  public clients: ClientDto[] = [];

  public selectedClients!: ClientDto[] | null;

  public selectedClient!: Client | null;

  public isLoading = false;

  public Delete : any;

  public disabledd = false;
  // public clientsSignal:Signal<ClientDto[]> = this.clientsService.getClients();

  ngOnInit() {
    this.loadClients();
  }

  loadClients(): void {
    this.clientsService.getClients().subscribe({
      next: (data) => {
          this.clients = data;
          // this.isLoading = true;
      },
      error:(e:HttpErrorResponse) =>{
        this.messageService.add({  severity: 'error',
        summary: 'Successful',
        detail: e.message,
        life: 3000,})
      }
    });
  }

  showAddModal(): void {
    this.displayAddEditModal = true;
    this.selectedClient = null;
  }

  hideAddModal(event: any): void {
    this.displayAddEditModal = !event;
  }

  showEditModal(client: Client): void {
    this.displayAddEditModal = true;
    this.selectedClient = client;
  }

  saveOrEditList():void{
    this.loadClients();
  }

  deleteClient(client: Client) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + client.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientsService.deleteClientById(client.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Client Deleted',
              life: 3000,
            });
            this.loadClients();
          },
        });
      },
    });
  }

  deleteSelectedClients() {
    let ids = this.selectedClients?.map(client => client.id!);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected clients?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientsService.deleteAllClientById(ids!)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Clients Deleted',
              life: 3000,
            });
            this.loadClients();
          },
        });
      },
    });

  }

  exportClientsJson():void { 
    if(this.selectedClients){
      let ids = this.selectedClients?.map(client => client.id!);
      this.clientsService.exportJson(ids).subscribe({
        next:(response:Blob) =>{
          const blob = new Blob([response], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = this.generateUniqueFileName();
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      }});
    }
  }

   generateUniqueFileName(): string {
    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  
    const timestamp = formatter.formatToParts(new Date())
      .map((part) => part.value)
      .join('');
  
    return `clientes_${timestamp}.json`;
  }


  getSeverity(status: string) {
    let currentStatus = status;
    switch (currentStatus) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'danger';
      default:
        '';
    }
    return currentStatus;
  }
}
