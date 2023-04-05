import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingComponent } from './stop-training.component';
import { Subject } from 'rxjs'
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  @Output() trainingExit = new EventEmitter();
  progress: number = 0;
  timer: number;

  constructor(private _dialog: MatDialog, private _trainingService: TrainingService) { }

  ngOnInit(): void {
    this.startOrResumeTimer();
  }
  
  startOrResumeTimer() {
    const step = this._trainingService.runningExercise.duration;
    console.log(step)
    this.timer = window.setInterval(() => {
      if (this.progress >= 100) {
        this._trainingService.completeExercise();
        window.clearInterval(this.timer);
      }
      this.progress = this.progress + 5;
    }, step);
  }

  onStop() {
    window.clearInterval(this.timer);
    const dialogRef = this._dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress,
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeTimer();
      }
    })

  }

}
