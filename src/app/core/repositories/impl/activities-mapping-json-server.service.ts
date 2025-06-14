import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Activity } from "../../models/activity.model";

export interface ActivityRaw {
    id: string
    title: string
    description:string
    location:string
    price:string
    advenId:string
}
@Injectable({
    providedIn: 'root'
  })
  export class ActivitiesMappingJsonServer implements IBaseMapping<Activity> {
    setAdd(data: Activity) {
        throw new Error("Method not implemented.");
    }
    setUpdate(data: any) {
        throw new Error("Method not implemented.");
    }
    getPaginated(page:number, pageSize: number, pages:number, data:ActivityRaw[]): Paginated<Activity> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Activity>((d:ActivityRaw)=>{
            return this.getOne(d);
        })};
    }
    getOne(data: ActivityRaw):Activity {
        return {
            id:data.id, 
            title:data.title, 
            description:data.description,
            location:data.location,
            price:data.price,
            advenId:data.advenId
            
        };
    }
    getAdded(data: any):Activity {
        throw new Error("Method not implemented.");
    }
    getUpdated(data: any):Activity {
        throw new Error("Method not implemented.");
    }
    getDeleted(data: any):Activity {
        throw new Error("Method not implemented.");
    }
  }
  