import { Component } from '@angular/core';
import { AppointmentsComponent } from './appointments/appointments.component';

@Component({
  selector: 'app-root',
  imports: [AppointmentsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'assessment-at-payever';
}
