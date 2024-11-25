import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Paginated } from "../models/paginated.model";
import { Activity } from "../models/activity.model";

export interface PaginatedRaw<T> {
    first: number
    prev: number|null
    next: number|null
    last: number
    pages: number
    items: number
    data: T[]
  };

  export interface ActivityRaw {
    id: string
    title: string
    location:string
    price:string
    description:string
    

}
@Injectable({
    providedIn:'root'
})
export class MyActivitiesService{

    private apiUrl:string = "http://localhost:3000/activities"
    constructor(
        private http:HttpClient
    ){

    }

    getAll(page:number, pageSize:number): Observable<Paginated<Activity>> {
        return this.http.get<PaginatedRaw<ActivityRaw>>(`${this.apiUrl}/?_page=${page}&_per_page=${pageSize}`).pipe(map(res=>{
            return {page:page, pageSize:pageSize, pages:res.pages, data:res.data.map<Activity>((d:ActivityRaw)=>{
                return {
                    id:d.id, 
                    title:d.title,
                    location:d.location,
                    price:d.price,
                    description:d.description,

                };
            })};
        }))
    }
}