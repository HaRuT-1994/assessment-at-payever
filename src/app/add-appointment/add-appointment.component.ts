import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.scss',
  imports: [MatInputModule, MatButtonModule, MatDialogModule, MatIconModule, ReactiveFormsModule, FormsModule,
    MatDatepickerModule, MatTimepickerModule,
],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAppointmentComponent {

  date!: Date;
  title!: string;



  addAppointment( ) {
    if(!this.date || !this.title) return;

    const myAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    myAppointments.push({date: this.date.getTime(), title: this.title});
    localStorage.setItem('appointments', JSON.stringify(myAppointments));
  }
}
