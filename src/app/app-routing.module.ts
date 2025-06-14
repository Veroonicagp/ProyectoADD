import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ManagerGuard } from './core/guards/manager.guard';
import { authRedirectGuard } from './core/guards/auth-redirect.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [authRedirectGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
    canActivate: [authRedirectGuard] 
  },
  {
    path: 'porfile',
    loadChildren: () => import('./pages/porfile/porfile.module').then( m => m.PorfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'activities',
    loadChildren: () => import('./pages/activities/activities.module').then( m => m.ActivitiesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mi-activities',
    loadChildren: () => import('./pages/mi-activities/mi-activities.module').then( m => m.MiActivitiesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'splash',
    loadChildren: () => import('./pages/splash/splash.module').then( m => m.SplashPageModule),
  },
  {
    path: 'adventurous',
    loadChildren: () => import('./pages/adventurous/adventurous.module').then( m => m.AdventurousPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-management',
    loadChildren: () => import('./pages/user-management/user-management.module').then( m => m.UserManagementPageModule),
    canActivate: [AuthGuard, ManagerGuard]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }