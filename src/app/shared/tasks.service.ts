import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import * as moment from "moment";

interface CreateResponse {
    name: string
}

export interface ITask {
    id?: string
    title: string
    date?: string
}

@Injectable ({ providedIn: 'root' })
export class TaskService {
    static url = 'https://organizer-practice-3029d-default-rtdb.firebaseio.com/tasks'

    constructor(private http: HttpClient) {}

    load(date: moment.Moment): Observable<ITask[]> {
        return this.http.get<ITask[]>(`${TaskService.url}/${date.format('DD-MM-YYYY')}.json`).pipe(map(tasks => {
            if(!tasks) {
                return []
            }
            return Object.keys(tasks).map(key => ({...tasks[parseInt(key)], id: key}))
        }))
    }

    create(task: ITask):Observable<ITask> {
        return this.http.post<CreateResponse>(`${TaskService.url}/${task.date}.json`, task).pipe(map(res => {return {...task, id: res.name}}))
    }

    remove(task: ITask): Observable<void> {
        return this.http.delete<void>(`${TaskService.url}/${task.date}/${task.id}.json`)
    }
}