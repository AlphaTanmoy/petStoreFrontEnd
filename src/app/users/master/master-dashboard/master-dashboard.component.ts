import { Component } from '@angular/core';
import { MicroserviceCheckComponent } from '../../../dashboard/microservice-check/microservice-check.component';
@Component({
  selector: 'app-master-dashboard',
  imports: [MicroserviceCheckComponent],
  templateUrl: './master-dashboard.component.html',
  styleUrl: './master-dashboard.component.css'
})
export class MasterDashboardComponent {

}
