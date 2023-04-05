import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();

  isAuth: boolean = false;
  isAuth$: Observable<boolean>;

  private _subs: Subscription[] = [];

  constructor(private _authService: AuthService, private _store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    // this._subs.push(
    //   this._authService.authChange.asObservable().subscribe(authStatus => {
    //     this.isAuth = authStatus;
    //   })
    // )
    this.isAuth$ = this._store.select(fromRoot.getIsAuth);
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this._authService.logout();
  }

  ngOnDestroy(): void {
    for (const sub of this._subs) {
      sub.unsubscribe();
    }
  }

}
