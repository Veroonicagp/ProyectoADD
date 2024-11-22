// src/app/core/repositories/interfaces/people-repository.interface.ts
import { Group } from "../../models/activity.model";
import { Person } from "../../models/adven.model";
import { IBaseRepository } from "./base-repository.interface";

export interface IGroupsRepository extends IBaseRepository<Group>{

}