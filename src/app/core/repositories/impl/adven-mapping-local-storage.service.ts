import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Adven } from "../../models/adven.model";

interface AdvenRaw{
    id:string,
    name:{
        title:string;
        first:string;
        last:string;
    },
    media:{
        url:string,
        large:string,
        medium:string,
        small:string,
        thumbnail:string
    }
}

@Injectable({
    providedIn: 'root'
  })
  export class AdvenLocalStorageMapping implements IBaseMapping<Adven> {
    setAdd(data: Adven) {
        throw new Error("Method not implemented.");
    }
    setUpdate(data: any) {
        throw new Error("Method not implemented.");
    }
    getPaginated(page:number, pageSize:number, pages:number, data: AdvenRaw[]): Paginated<Adven> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Adven>((d:AdvenRaw)=>{
            return this.getOne(d);
        })};
    }
    getOne(data: AdvenRaw):Adven {
        return {
            id:data.id, 
            name:data.name.first, 
            surname:data.name.last, 
            media:{
                url:data.media.url,
                large:data.media.large, 
                medium:data.media.medium,
                small:data.media.small,
                thumbnail:data.media.thumbnail
            }};
    }
    getAdded(data: AdvenRaw):Adven {
        return this.getOne(data);
    }
    getUpdated(data: AdvenRaw):Adven {
        return this.getOne(data);
    }
    getDeleted(data: AdvenRaw):Adven {
        return this.getOne(data);
    }
  }
  