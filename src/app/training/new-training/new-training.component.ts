import { Component, OnInit, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  private _subs: Subscription[] = [];
  exercises: Exercise[] = [];

  constructor(private _trainingService: TrainingService) {

  }

  ngOnInit() {
    this.exercises = this._trainingService.availableExercises;
    this._subs.push(this._trainingService.exercisesChanged.subscribe(exercises => this.exercises = exercises));
    // const test = doc(collection(this._db, '/users'));
    // const test2 = await getDoc(test);

    // console.log(test2.data())

    // if (test2.exists()) {
    //   console.log("Document data:", test2.data());
    // } else {
    //   // doc.data() will be undefined in this case
    //   console.log("No such document!");
    // }
  
  }

  fetch() {
    this.exercises = this._trainingService.availableExercises;
  }

  onStartTraining(form: NgForm): void {
    this._trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    for (const sub of this._subs) {
      sub.unsubscribe();
    }

    this._subs = [];
  }

}
