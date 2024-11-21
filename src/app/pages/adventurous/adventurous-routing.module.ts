import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdventurousPage } from './adventurous.page';

const routes: Routes = [
  {
    path: '',
    component: AdventurousPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdventurousPageRoutingModule {}
