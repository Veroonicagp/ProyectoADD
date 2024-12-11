import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
    
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'porfile',
    loadChildren: () => import('./pages/porfile/porfile.module').then( m => m.PorfilePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'activities',
    loadChildren: () => import('./pages/activities/activities.module').then( m => m.ActivitiesPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'mi-activities',
    loadChildren: () => import('./pages/mi-activities/mi-activities.module').then( m => m.MiActivitiesPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'splash',
    loadChildren: () => import('./pages/splash/splash.module').then( m => m.SplashPageModule),
  },
  {
    path: 'adventurous',
    loadChildren: () => import('./pages/adventurous/adventurous.module').then( m => m.AdventurousPageModule),
    canActivate:[AuthGuard]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
