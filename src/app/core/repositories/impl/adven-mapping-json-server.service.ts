import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Adven } from "../../models/adven.model";

export interface AdvenRaw {
    id?: string
    nombre: string
    apellidos: string
    email: string
}
@Injectable({
    providedIn: 'root'
  })
  export class AdvenMappingJsonServer implements IBaseMapping<Adven> {
    toGenderMapping:any = {
        Masculino:'male',
        Femenino:'female',
        Otros:'other'
    };
    
    fromGenderMapping:any = {
        male:'Masculino',
        female:'Femenino',
        other:'Otros'
    };

    setAdd(data: Adven):AdvenRaw {
        return {
            nombre:data.name,
            apellidos:data.surname,
            email:data.email??'',
        };
    }
    setUpdate(data: Adven):AdvenRaw {
        let toReturn:any = {};  
        Object.keys(data).forEach(key=>{
            switch(key){
                case 'name': toReturn['nombre']=data[key];
                break;
                case 'surname': toReturn['apellidos']=data[key];
                break;
                case 'email': toReturn['email']=data[key];
                break;
                default:
            }
        });
        return toReturn;
    }
    getPaginated(page:number, pageSize: number, pages:number, data:AdvenRaw[]): Paginated<Adven> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Adven>((d:AdvenRaw)=>{
            return this.getOne(d);
        })};
    }
    getOne(data: AdvenRaw):Adven {
        return {
            id:data.id!, 
            name:data.nombre, 
            surname:data.apellidos, 
            email:(data as any)["email"]??'',
            media:(data as any)["media"]?{
                url:(data as any)["media"].url,
                large:(data as any)["media"].large, 
                medium:(data as any)["media"].medium,
                small:(data as any)["media"].small,
                thumbnail:(data as any)["media"].thumbnail
            }:undefined};
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
  