import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { PrimeNgModule } from '../../../components/prime-ng/prime-ng.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClientsService } from '../../../services/clients.service';
import { BookingsService } from '../../../services/bookings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hotel-user-home',
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css',
})
export default class UserHomeComponent implements OnInit,OnDestroy {
  
  private fb = inject(FormBuilder);

  private clientService = inject(ClientsService);

  private bookingService = inject(BookingsService);

  private subscription = new Subscription();

  public basicData: any;

  public basicOptions: any;

  public data: any;

 public  options: any;

  public formGroup: FormGroup = this.fb.group({
    rangeDates: [''],
    monthAnio: [''],
  });

  ngOnInit(): void {
    this.loadChartBar();
    this.loadChartLine();
   }


  getBookingCountByDate(): void {
    let monthAnio = this.formGroup.get('monthAnio')?.value as Date;
    if(!monthAnio){
      console.log('No hay fecha seleccionada');
      return;
    }
    
   let convertStringMonth =  monthAnio.toLocaleDateString('en-ES',{month:'long'});
   let valor = monthAnio.toLocaleDateString('en-GB', {
      month: 'numeric',
      year: 'numeric',
    }).split('/');

    this.subscription = this.bookingService.getBookingCountByDate(valor[0], valor[1]).subscribe((response : any[]) =>{
      response.map(data => {
        let precioTotal = data.totalPrice ? data.totalPrice : 0;
        let totalBookings = data.totalBookings ? data.totalBookings : 0;
        this.data = {
          labels: [convertStringMonth],
          datasets: [
              {
                label: 'Total Bookings',
                fill: false,
                borderColor: [
                  'rgb(255, 159, 64)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                ],
                yAxisID: 'y',
                tension: 0.4,
                data: [totalBookings]
              },
              {
                label: 'Precio Total = ' + precioTotal,
          },
          ]
      };
      return data;
      })   
    });

  }


  getClientsByDate(): void {
    let fechas = this.formGroup.get('rangeDates')?.value as Date[];
    if (fechas) {
      let valor = this.convertDate(fechas);
      if (!valor[0] || !valor[1]) {
        this.formGroup.get('rangeDates')?.setErrors({ required: true });
        return;
      }
      let dates = valor.map((date) => date);

      this.subscription =  this.clientService
        .getCountClientsByDates(valor[0], valor[1])
        .subscribe((data) => {
          const totalClients = data.map((value: any) => value.total);

          this.basicData = {
            labels: dates,
            datasets: [
              {
                label: 'Registros',
                data: totalClients,
                backgroundColor: [
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                  'rgb(255, 159, 64)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                ],
                borderWidth: 1,
              },
            ],
          };
        });
    }
  }

  private convertDate(date: Date[]): string[] {
    return date
      .filter((x) => x != null)
      .map((x) => {
        return x
          .toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          })
          .split('/')
          .join('-');
      });
  }


  loadChartLine() : void {
    const documentStyle = getComputedStyle(document.documentElement);

    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    
    this.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Total Costo ',
                fill: false,
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                yAxisID: 'y',
                tension: 0.4,
                data: [65, 59, 80, 81, 56, 55, 10]
            },
            {
              label: 'Second Dataset',
              data: [28, 48, 40, 19, 86, 27, 90],
              fill: false,
              borderColor: documentStyle.getPropertyValue('--pink-500'),
              tension: 0.4
          },
        ]
    };
    
    this.options = {
        stacked: false,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor,
                }
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                ticks: {
                    color: textColorSecondary,
                    stepSize:1
                },
                grid: {
                    color: surfaceBorder
                }
            },
            x: {
              ticks: {
                  color: textColorSecondary,
                  stepSize:1
                  
              },
              grid: {
                  color: surfaceBorder
                }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            ticks: {
                color: textColorSecondary,
                // stepSize:1
            },
            grid: {
                drawOnChartArea: false,
                color: surfaceBorder
            }
        }
           
        }
    };
 
  }

  loadChartBar() : void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicData = {
    //   labels: [],
      datasets: [
        {
          label: 'Ninguna fecha seleccionada',
        //   data: [],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
          ],
          borderWidth: 1,
        },
      ],
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
            stepSize:1
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}
