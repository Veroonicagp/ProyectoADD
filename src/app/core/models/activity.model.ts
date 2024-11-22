import { Model } from "./base.model";
import { Adven } from "./adven.model";

export interface Activity extends Model{
    owner:Adven,
    title:string,
    description:string,
    location:string,
    price:string

}