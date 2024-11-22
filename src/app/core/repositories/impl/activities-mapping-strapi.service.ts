import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Activity } from "../../models/activity.model";

export interface ActivityRaw {
    data: Data
    meta: Meta
  }
  
export interface Data {
    id: number
    attributes: ActivityAttributes
}
export interface ActivityData {
    data: ActivityAttributes;
}

export interface ActivityAttributes {
    title: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

export interface Meta {}

@Injectable({
    providedIn: 'root'
  })
  export class ActivitiesMappingStrapi implements IBaseMapping<Activity> {
    

    setAdd(data: Activity):ActivityData {
        return {
            data:{
                title:data.title
            }
        };
    }
    setUpdate(data: Activity):ActivityData {
        let toReturn:ActivityData = {
            data:{
                title:""
            }
        };  
        Object.keys(data).forEach(key=>{
            switch(key){
                case 'title': toReturn.data['title']=data[key];
                break;
                default:
            }
        });
        return toReturn;
    }
    getPaginated(page:number, pageSize: number, pages:number, data:Data[]): Paginated<Activity> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Activity>((d:Data)=>{
            return this.getOne(d);
        })};
    }
    getOne(data: Data | ActivityRaw): Activity {
        const isActivityRaw = (data: Data | ActivityRaw): data is ActivityRaw => 'meta' in data;
        
        const attributes = isActivityRaw(data) ? data.data.attributes : data.attributes;
        const id = isActivityRaw(data) ? data.data.id : data.id;

        return {
            id: id.toString(),
            title: attributes.title,
            description:attributes.,
            location:,
            price:,
            
        };
    }
    getAdded(data: ActivityRaw):Activity {
        return this.getOne(data.data);
    }
    getUpdated(data: ActivityRaw):Activity {
        return this.getOne(data.data);
    }
    getDeleted(data: ActivityRaw):Activity {
        return this.getOne(data.data);
    }
  }
  