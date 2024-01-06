import { Component } from '@angular/core';
import { PrimeNgModule } from '../../../components/prime-ng/prime-ng.module';

@Component({
  selector: 'hotel-user-home',
  standalone: true,
  imports: [PrimeNgModule],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export default class UserHomeComponent {
  showDialog(){

  }
  visible: boolean = false;
}
