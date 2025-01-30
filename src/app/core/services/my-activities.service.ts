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
    attributes: {
        title: string;
        location: string;
        price: string;
        description: string;
        advenId: string;
    };
    

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

    /**getAll(userId:string){
        return this.http.get<PaginatedRaw<ActivityRaw>>(`${this.apiUrl}?filters[persona][id][$eq]=${userId}&populate=*`);
    }**/

    getByAdvenId(advenId:string, page:number, pageSize:number): Observable<Paginated<Activity>> {
        return this.http.get<PaginatedRaw<ActivityRaw>>(`${this.apiUrl}?filters[advenId][id][$eq]=${advenId}&populate=*/?_page=${page}&_per_page=${pageSize}`).pipe(map(res=>{
            console.log('Datos recibidos de la API:', res);
            return {page:page, pageSize:pageSize, pages:res.pages, data:res.data.map<Activity>((d:ActivityRaw)=>{
                console.log('Dato mapeadod:', d);
                return {
                    id:d.id,
                    title:d.attributes.title,
                    location:d.attributes.location,
                    price:d.attributes.price,
                    description:d.attributes.description,
                    advenId:d.attributes.advenId
                };
            })};
        }))
    }
}