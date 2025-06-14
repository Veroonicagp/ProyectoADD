import { Adven } from "./adven.model";
import { Model } from "./base.model";

export interface Activity extends Model{
    title:string,
    location:string,
    price:string
    description:string,
    advenId:string,
    media?:{
        url:string | undefined,
        large:string | undefined,
        medium:string | undefined,
        small:string | undefined,
        thumbnail:string | undefined
    },
}