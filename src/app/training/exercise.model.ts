
import { DateTime } from 'luxon';

export interface Exercise {
    id: string;
    name: string;
    duration: number;
    calories: number;
    date?: DateTime;
    state?: 'completed' | 'cancelled' | null;
}