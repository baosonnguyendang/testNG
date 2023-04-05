import { Action } from "@ngrx/store";
import { Exercise } from "./exercise.model";

export const SET_AVAILABLE_TRAININGS = '[Training] Set available trainings';
export const SET_FINISHED_TRAININGS = '[Training] Set finished trainings';
export const START_TRAINING = '[Training] start training';
export const STOP_TRAINING = '[Training] stop training';

export class SetAvailabelTrainings implements Action {
    readonly type = SET_AVAILABLE_TRAININGS;

    constructor(public payload: Exercise[]){}
}

export class SetFinishedTrainings implements Action {
    readonly type = SET_FINISHED_TRAININGS;

    constructor(public payload: Exercise[]){}
}

export class SrartTraining implements Action {
    readonly type = START_TRAINING;

    constructor(public payload: string){}
}

export class StopTraining implements Action {
    readonly type = STOP_TRAINING;

}

export type TrainingActions = SetAvailabelTrainings | SetFinishedTrainings | SrartTraining | StopTraining ;