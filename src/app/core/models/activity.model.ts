// src/app/core/person.model.ts
import { Adven } from "./adven.model";
import { Model } from "./base.model";

export interface Activity extends Model{
    title:string,
    location:string,
    price:string
    description:string,
    advenId?:string
}