import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiActivitiesPage } from './mi-activities.page';

const routes: Routes = [
  {
    path: '',
    component: MiActivitiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiActivitiesPageRoutingModule {}
