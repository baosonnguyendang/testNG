import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() sidenavClose = new EventEmitter<void>();

  isAuth$: Observable<boolean>;

  private _subs: Subscription[] = [];
  private _isAuth: boolean = false;

  constructor(private _authService: AuthService, private _store: Store<fromRoot.State>) {
    this._subs.push(
      this._authService.authChange.asObservable().subscribe(authStatus => {
        this._isAuth = authStatus;
      })
    )
    this.isAuth$ = this._store.select(fromRoot.getIsAuth);
  }

  ngOnInit(): void {
  }

  onClose() {
    this.sidenavClose.emit();
  }

  onLogout() {
    this.onClose();
    this._authService.logout();
  }

  ngOnDestroy(): void {
    for (const sub of this._subs) {
      sub.unsubscribe();
    }
  }

  get isAuth(): boolean {
    return this._isAuth
  }

}
