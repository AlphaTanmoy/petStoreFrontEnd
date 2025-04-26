import { Component } from '@angular/core';
import { MicroserviceCheckComponent } from '../../../dashboard/microservice-check/microservice-check.component';
import { MicroserviceActionComponent } from '../../../dashboard/microservice-action/microservice-action.component';

@Component({
  selector: 'app-master-dashboard',
  imports: [MicroserviceCheckComponent, MicroserviceActionComponent],
  templateUrl: './master-dashboard.component.html',
  styleUrl: './master-dashboard.component.css'
})
export class MasterDashboardComponent {

}
