// src/app/core/repositories/interfaces/people-repository.interface.ts

import { IBaseRepository } from "./base-repository.interface";
import { Task } from "../../models/activity.model";
export interface ITasksRepository extends IBaseRepository<Task>{

}