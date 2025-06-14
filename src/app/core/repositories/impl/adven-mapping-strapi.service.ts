import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Adven } from "../../models/adven.model";
import { StrapiMedia } from "../../services/impl/strapi-media.service";


interface MediaRaw{
    data: StrapiMedia
}
interface UserRaw{
    data: UserData
}

interface UserData{
    id: number
    attributes: UserAttributes
}

interface UserAttributes {
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
  }
  interface ActivityRaw{
    data: ActivityData,
    meta: Meta
}

interface ActivityData {
    id: number
    attributes: ActivityAttributes
}
  
interface ActivityAttributes {
    name: string
    createdAt: string
    updatedAt: string
    publishedAt: string
}

interface AdvenRaw {
    data: Data
    meta: Meta
  }
  
interface Data {
    id: number
    attributes: AdvenAttributes
}
interface AdvenData {
    data: AdvenAttributes;
}

interface AdvenAttributes {
    name: string
    surname: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
    user:UserRaw | number | null,
    media:MediaRaw | number | null
}

interface ActivityAttributes {
    name: string
}

interface Meta {}

@Injectable({
    providedIn: 'root'
  })
  export class AdvenMappingStrapi implements IBaseMapping<Adven> {

    setAdd(data: Adven):AdvenData {
        return {
            data:{
                name:data.name,
                surname:data.surname,
                user:data.userId?Number(data.userId):null,
                media:data.media?Number(data.media):null
            }
        };
    }
    setUpdate(data: Partial<Adven>): AdvenData {
        const mappedData: Partial<AdvenAttributes> = {};

        Object.keys(data).forEach(key => {
            switch(key){
                case 'name': mappedData.name = data[key];
                break;
                case 'surname': mappedData.surname = data[key];
                break;
                case 'userId': mappedData.user = data[key] ? Number(data[key]) : null;
                break;
                case 'media': mappedData.media = data[key] ? Number(data[key]) : null;
                break;
            }
        });

        return {
            data: mappedData as AdvenAttributes
        };
    }

    getPaginated(page:number, pageSize: number, pages:number, data:Data[]): Paginated<Adven> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Adven>((d:Data|AdvenRaw)=>{
            return this.getOne(d);
        })};
    }
    getOne(data: Data | AdvenRaw): Adven {
        const isAdvenRaw = (data: Data | AdvenRaw): data is AdvenRaw => 'meta' in data;

        const attributes = isAdvenRaw(data) ? data.data.attributes : data.attributes;
        const id = isAdvenRaw(data) ? data.data.id : data.id;
        
        return {
            id: id.toString(),
            name: attributes.name,
            surname: attributes.surname,
            userId: typeof attributes.user === 'object' ? attributes.user?.data?.id.toString() : undefined,
            media: typeof attributes.media === 'object' ? {
                url: attributes.media?.data?.attributes?.url,
                large: attributes.media?.data?.attributes?.formats?.large?.url || attributes.media?.data?.attributes?.url,
                medium: attributes.media?.data?.attributes?.formats?.medium?.url || attributes.media?.data?.attributes?.url,
                small: attributes.media?.data?.attributes?.formats?.small?.url || attributes.media?.data?.attributes?.url,
                thumbnail: attributes.media?.data?.attributes?.formats?.thumbnail?.url || attributes.media?.data?.attributes?.url,
            } : undefined
        };
    }
    getAdded(data: AdvenRaw):Adven {
        return this.getOne(data.data);
    }
    getUpdated(data: AdvenRaw):Adven {
        return this.getOne(data.data);
    }
    getDeleted(data: AdvenRaw):Adven {
        return this.getOne(data.data);
    }
  }
  