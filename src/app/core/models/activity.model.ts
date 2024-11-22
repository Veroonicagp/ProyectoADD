// src/app/core/person.model.ts
import { Adven } from "./adven.model";
import { Model } from "./base.model";

export interface Activity extends Model{
    title:string,
    description:string,
    location:string,
    price:string
}