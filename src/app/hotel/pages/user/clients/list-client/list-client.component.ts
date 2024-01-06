import {
  Component,
  OnInit,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ClientDto } from '../../../../interfaces/client-interface';
import { ClientsService } from '../../../../services/clients.service';
import { PrimeNgModule } from '../../../../components/prime-ng/prime-ng.module';
import { ConfirmationService, MessageService } from 'primeng/api';

import AddEditClientComponent from '../add-edit-client/add-edit-client.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
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

  selectedProducts!: any[] | null;

  public selectedClient!: ClientDto | null;

  public isLoading = false;

  submitted: boolean = false;

  // public clientsSignal:Signal<ClientDto[]> = this.clientsService.getClients();

  ngOnInit() {
    this.loadClients();
  }

  loadClients(): void {
    this.clientsService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.isLoading = true;
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

  showEditModal(client: ClientDto): void {
    this.displayAddEditModal = true;
    this.selectedClient = client;
  }

  saveOrEditList():void{
    this.loadClients();
  }

  deleteClient(client: ClientDto) {
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

  deleteSelectedProducts() {
    // this.confirmationService.confirm({
    //     message: 'Are you sure you want to delete the selected products?',
    //     header: 'Confirm',
    //     icon: 'pi pi-exclamation-triangle',
    //     accept: () => {
    //         this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
    //         this.selectedProducts = null;
    //         this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    //     }
    // });
  }

  

  // findIndexById(id: string): number {
  //     let index = -1;
  //     for (let i = 0; i < this.clients.length; i++) {
  //         if (this.clients[i].id === id) {
  //             index = i;
  //             break;
  //         }
  //     }

  //     return index;
  // }

  // createId(): string {
  //   let id = '';
  //   var chars =
  //     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   for (var i = 0; i < 5; i++) {
  //     id += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return id;
  // }

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
