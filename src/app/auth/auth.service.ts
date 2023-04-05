import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from '@firebase/auth';
import { TrainingService } from '../training/training.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';

import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {
  auth = getAuth();
  authChange = new Subject<boolean>();

  private _user: User | null;
  private _isAuth: boolean = false;

  constructor(
    private _router: Router,
    private _trainingService: TrainingService,
    private _snackBar: MatSnackBar,
    private _uiService: UIService,
    private _store: Store<fromRoot.State>,
  ) {}

  initAuthListener(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this._authSuccess();
      } else {
        this._trainingService.cancelSubs();
        this._store.dispatch(new Auth.SetUnauthenticated())
        this._router.navigate(['/login']);
        this._isAuth = false;
        signOut(this.auth);
      }
    });
  }

  registerUser(authData: AuthData) {
    this._user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(),
    };

    //this._store.dispatch({type: 'START_LOADING'});
    this._uiService.loadingStateChanged.next(true);

    createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((res) => {
        this._uiService.loadingStateChanged.next(true);
        console.log(res);
        this._authSuccess();
      })
      .catch((err) => {
        this._uiService.loadingStateChanged.next(true);
        this._uiService.showSnackBar(err.message, null, 3000);
        console.log(err);
      });
  }

  login(authData: AuthData) {
    this._store.dispatch(new UI.StartLoading());
    //this._uiService.loadingStateChanged.next(true);
    this._user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(),
    };
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((res) => {
        //this._uiService.loadingStateChanged.next(false);
        this._store.dispatch(new UI.StopLoading());
        console.log(res);
        this._authSuccess();
      })
      .catch((err) => {
        //this._uiService.loadingStateChanged.next(false);
        this._store.dispatch(new UI.StopLoading());
        this._uiService.showSnackBar(err.message, null, 3000);
        console.log(err);
      });
  }

  logout() {
    this._trainingService.cancelSubs();
    this.authChange.next(false);
    this._router.navigate(['/login']);
    this._isAuth = false;
    signOut(this.auth);
  }

  getUser() {
    return { ...this._user };
  }

  isAuth() {
    return this._isAuth;
  }

  private _authSuccess() {
    this._store.dispatch(new Auth.SetAuthenticated());
    // this._isAuth = true;
    // this.authChange.next(true);
    this._router.navigate(['/training']);
  }
}
