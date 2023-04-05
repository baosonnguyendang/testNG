import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css'],
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _subs: Subscription[] = [];

  displayedColumns: string[] = [
    'date',
    'name',
    'calories',
    'duration',
    'state',
  ];
  dataSource: MatTableDataSource<Exercise> = new MatTableDataSource();

  constructor(private _trainingService: TrainingService) {}

  ngOnInit(): void {
    //this.dataSource = new MatTableDataSource(this._trainingService.getFinishedExercise());
    this._trainingService.getFinishedExercise();
    this._subs.push(
      this._trainingService.finishedExercisesChanged.subscribe((exercises: Exercise[]) => {
        console.log(exercises);
        if (exercises) {
          this.dataSource.data = exercises;
        }
      }),
    )
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    for (const sub of this._subs) {
      sub.unsubscribe();
    }
    this._subs = [];
  }

}
