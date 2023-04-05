import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";

@Injectable()
export class UIService {
    loadingStateChanged = new Subject<boolean>();

    constructor(private _snackbar: MatSnackBar) {

    }

    showSnackBar(message, action, duration) {
        this._snackbar.open(message, action, {
            duration: duration
        })
    }
}