import { Injectable, OnDestroy } from '@angular/core';
import { Exercise } from './exercise.model';
import { Subject, Subscription } from 'rxjs';
import { DateTime } from 'luxon';
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  Timestamp,
} from '@firebase/firestore';
import { collectionData, Firestore, setDoc } from '@angular/fire/firestore';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';

import * as fromTraining from './training.reducer';
import * as Training from './training.actions';


@Injectable()
export class TrainingService {

  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private _availableExercises: Exercise[] = [];
  private _exercises: Exercise[] = [];
  private _runningExercise: Exercise;
  private _subs: Subscription[] = [];

  constructor(private _db: Firestore, private _uiService: UIService, private _store: Store<fromTraining.State>) {
    const data = collection(_db, '/users');
    this._subs.push(
      collectionData(data)
      .pipe(
        map((x) =>
          x.map((y) => {
            return { ...y, id: y.name.toLowerCase().replace(' ', '-') };
          })
        )
      )
      .subscribe((x) => {
        console.log(x);
        // this._availableExercises = x as Exercise[];
        // this.exercisesChanged.next([...this._availableExercises]);
        this._store.dispatch(new Training.SetAvailabelTrainings(x as Exercise[]))
      }, (err) => {
        this.exercisesChanged.next(null);
        this._uiService.loadingStateChanged.next(false);
        this._uiService.showSnackBar('failed', null, 3000);
      }),
    )
  }

  startExercise(selectedId: string) {
    // this._runningExercise = this.availableExercises.find(
    //   (x) => x.id === selectedId
    // )!;
    // this.exerciseChanged.next({ ...this._runningExercise });
    this._store.dispatch(new Training.SrartTraining(selectedId))
  }

  completeExercise() {
    this._addData({
      ...this._runningExercise,
      date: JSON.stringify(DateTime.now()),
      state: 'completed',
    });
    // this._exercises.push({
    //   ...this._runningExercise,
    //   date: DateTime.now(),
    //   state: 'completed',
    // });
    // this._runningExercise = null;
    // this.exerciseChanged.next(null);
    this._store.dispatch(new Training.StopTraining());
  }

  cancelExercise(progress: number) {
    console.log(
      JSON.stringify(DateTime.now()),
      DateTime.fromISO(JSON.parse(JSON.stringify(DateTime.now())))
    );
    this._addData({
      ...this._runningExercise,
      duration: this._runningExercise.duration * (progress / 100),
      calories: this._runningExercise.duration * (progress / 100),
      date: JSON.stringify(DateTime.now()),
      state: 'cancelled',
    });
    // this._runningExercise = null;
    // this.exerciseChanged.next(null);
    this._store.dispatch(new Training.StopTraining());
  }

  private async _addData(exercise: Exercise) {
    const finish = doc(collection(this._db, 'finishedExercises'));
    await setDoc(finish, exercise);
  }

  get runningExercise() {
    return { ...this._runningExercise };
  }

  get availableExercises() {
    return this._availableExercises.slice();
  }

  getFinishedExercise() {
    const finish = collection(this._db, 'finishedExercises');
    this._subs.push(
      collectionData(finish)
      .pipe(
        map((x) => x as unknown as Exercise[]),
        map((x) =>
          x.map(({ calories, date, duration, id, name, state }) => ({
            calories,
            date: DateTime.fromISO(JSON.parse(date)),
            duration,
            id,
            name,
            state,
          }))
        )
      )
      .subscribe((x: Exercise[]) => {
        //this.finishedExercisesChanged.next(x);
        this._store.dispatch(new Training.SetFinishedTrainings(x))
      })
    )
  }

  cancelSubs(): void {
    for (const sub of this._subs) {
      sub.unsubscribe();
    }

    this._subs = [];
  }
}
