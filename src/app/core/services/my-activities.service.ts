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

    private apiUrl:string = "http://localhost:1337/api/activities"
    constructor(
        private http:HttpClient
    ){

    }

    getAll(userId:string){
        return this.http.get<PaginatedRaw<ActivityRaw>>(`${this.apiUrl}?filters[persona][id][$eq]=${userId}&populate=*`);
    }
}