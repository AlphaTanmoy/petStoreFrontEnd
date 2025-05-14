import { Component } from '@angular/core';
import { MicroserviceCheckComponent } from '../../../dashboard/microservice-check/microservice-check.component';
import { MicroserviceActionComponent } from '../../../dashboard/microservice-action/microservice-action.component';
import { MvnRunnerListComponent } from '../../../dashboard/mvn-runner-list/mvn-runner-list.component';
import { ServerInfoComponent } from '../../../dashboard/server-info/server-info.component';
import { NavbarControlComponent } from '../navbar-control/navbar-control.component';
@Component({
  selector: 'app-master-dashboard',
  imports: [MicroserviceCheckComponent, MicroserviceActionComponent, MvnRunnerListComponent, ServerInfoComponent, NavbarControlComponent],
  templateUrl: './master-dashboard.component.html',
  styleUrl: './master-dashboard.component.css'
})
export class MasterDashboardComponent {

}
