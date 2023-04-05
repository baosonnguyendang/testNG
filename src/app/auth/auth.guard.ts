import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import * as fromRoot from '../app.reducer';
import { Store } from "@ngrx/store";
import { take } from "rxjs/operators";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
    constructor(private _authService: AuthService, private _router: Router, private _store: Store<fromRoot.State>){

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // if (!this._authService.isAuth()) {
        //     this._router.navigate(['login']);
        //     return false;
        // }
        // return true;
        return this._store.select(fromRoot.getIsAuth).pipe(take(1));;
    }

    canLoad(route: Route) {
        return this._store.select(fromRoot.getIsAuth).pipe(take(1));
        // if (!this._authService.isAuth()) {
        //     this._router.navigate(['login']);
        //     return false;
        // }
        // return true;
    }
}