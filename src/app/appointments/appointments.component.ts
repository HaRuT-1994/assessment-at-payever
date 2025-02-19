import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, model } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AddAppointmentComponent } from '../add-appointment/add-appointment.component';
import { IAppointment } from '../appointment.model';
import {CdkDragDrop, CdkDropList, CdkDrag} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-appointments',
  imports: [MatButtonModule, MatIconModule, DatePipe, MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, NgClass, CdkDropList, CdkDrag],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsComponent {
  selectedDate = model<Date>(new Date());

  initialAppointmentDates: any[] = [ '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12AM', '1PM', '2PM','3PM','4PM', '5PM','6PM', '7PM', '8PM', '9PM', '10PM', '11PM'];
  appointmentDates: Array<string | {time: string, appointment: IAppointment}>  = [ '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12AM', '1PM', '2PM','3PM','4PM', '5PM','6PM', '7PM', '8PM', '9PM', '10PM', '11PM'];
  private selectedDayAppoinetMents: IAppointment[] = [];

  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getSelectedDayAppoinetMents();
  }

  showAddAppointment(): void {
    this.dialog.open(AddAppointmentComponent).afterClosed().subscribe(() => {
      this.getSelectedDayAppoinetMents();
    });
  }
  
  private getAppoinetMents(): IAppointment[] {
    const myAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    return myAppointments;
  }

  private getSelectedDayAppoinetMents() {
    const appointments = this.getAppoinetMents();
    this.selectedDayAppoinetMents = appointments.filter((i: IAppointment) => {
      const utcDate = new Date(i.date);

      return utcDate.getFullYear() === this.selectedDate()?.getFullYear() &&
             utcDate.getDate() === this.selectedDate()?.getDate() &&
             utcDate.getMonth() === this.selectedDate()?.getMonth();
    })

    this.setAppoinetMentOnView(this.selectedDayAppoinetMents);
  }

  private setAppoinetMentOnView(data: IAppointment[]) {
    this.appointmentDates = [...this.initialAppointmentDates];

    this.appointmentDates.forEach((i: any, idx) => {
      data.forEach(appointment => {
        let hours = new Date(appointment.date).getHours();
        const amPm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const meridenHour = `${hours}${amPm}`;
  
        if(i === meridenHour || i?.time === meridenHour) {
          this.appointmentDates[idx] = { time: i?.time || i, appointment };
        }
      })
    })
    this.appointmentDates = [...this.appointmentDates];
    this.cdr.detectChanges();
  }

  removeAppointment(appointment: IAppointment): void {  
    const appointments = this.getAppoinetMents();
    appointments.splice(appointments.indexOf(appointment), 1);
   
    localStorage.setItem('appointments', JSON.stringify(appointments));
    this.getSelectedDayAppoinetMents();
  }

  drop(event: CdkDragDrop<string[]>) {
    const currentItem = this.appointmentDates[event.currentIndex];
    this.appointmentDates[event.currentIndex] = {time: currentItem, appointment: this.appointmentDates[event.previousIndex].appointment};
    this.appointmentDates[event.previousIndex] = this.appointmentDates[event.previousIndex].time;
  }

  forwardDay() {
    const date = this.selectedDate().setDate(this.selectedDate().getDate() + 1);
    this.selectedDate.set(new Date(date));
    this.getSelectedDayAppoinetMents();
  }

  backDay() {
    const date = this.selectedDate().setDate(this.selectedDate().getDate() - 1);
    this.selectedDate.set(new Date(date));
    this.getSelectedDayAppoinetMents();
  }

  today() {
    this.selectedDate.set(new Date());
    this.getSelectedDayAppoinetMents();
  }
}
