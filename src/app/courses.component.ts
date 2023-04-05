import { Component } from '@angular/core';
import { CoursesService } from './course/courses.service';

@Component({
  selector: 'courses',
  template: `
    <h3>Coursesssss {{title}} </h3>
      <ul>
        <li *ngFor='let course of courses'>
          {{ course }}
        </li>
    </ul>
  `
})
export class CoursesComponent {
  title = 'test123';
  courses;

  constructor(service: CoursesService) {
    this.courses = service.getCourses();
  }
}