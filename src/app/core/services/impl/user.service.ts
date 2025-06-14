import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, forkJoin, of } from 'rxjs';
import { map, switchMap, tap, filter, distinctUntilChanged } from 'rxjs/operators';
import { UserWithRole, RoleType, ROLES, Permission } from '../../models/user-role.model';
import { BaseAuthenticationService } from './base-authentication.service';
import { AdvenService } from './adven.service';
import { ActivitiesService } from './activities.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _users = new BehaviorSubject<UserWithRole[]>([]);
  public users$ = this._users.asObservable();

  private _currentUserRole = new BehaviorSubject<RoleType>('user');
  public currentUserRole$ = this._currentUserRole.asObservable();

  constructor(
    private authService: BaseAuthenticationService,
    private advenService: AdvenService,
    private activitiesService: ActivitiesService
  ) {
    this.initializeRoleSubscription();
  }

  private initializeRoleSubscription() {
    this.authService.user$.pipe(
      distinctUntilChanged((prev, curr) => {
        const prevEmail = prev?.email || null;
        const currEmail = curr?.email || null;
        return prevEmail === currEmail;
      })
    ).subscribe(user => {
      if (user && user.email) {
        const newRole = this.getUserRoleFromEmail(user.email);
        this._currentUserRole.next(newRole);
      } else {
        this._currentUserRole.next('user');
      }
    });

    this.authService.authenticated$.pipe(
      distinctUntilChanged()
    ).subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this._currentUserRole.next('user');
      } else {
        this.updateCurrentUserRole();
      }
    });
  }

  private async updateCurrentUserRole() {
    try {
      const currentUser = await this.authService.getCurrentUser();
      if (currentUser && currentUser.email) {
        const userRole = this.getUserRoleFromEmail(currentUser.email);
        this._currentUserRole.next(userRole);
      }
    } catch (error) {
      console.error('Error actualizando rol de usuario:', error);
    }
  }

  private getUserRoleFromEmail(email: string): RoleType {
    const managerEmails = [
      'rocio@gmail.com',
      'veronicagp@gmail.com',
      'admin@readytooenjoy.com'
    ];
    
    const normalizedEmail = email.toLowerCase().trim();
    const isManager = managerEmails.includes(normalizedEmail);
    
    return isManager ? 'manager' : 'user';
  }

  getCurrentUserRole(): Observable<RoleType> {
    return this.currentUserRole$;
  }

  hasPermission(permission: Permission): Observable<boolean> {
    return this.currentUserRole$.pipe(
      map(role => {
        const roleConfig = role === 'manager' ? ROLES.MANAGER : ROLES.USER;
        return roleConfig.permissions.includes(permission);
      })
    );
  }

  isManager(): Observable<boolean> {
    return this.currentUserRole$.pipe(
      map(role => role === 'manager')
    );
  }

  async reloadUserRole() {
    await this.updateCurrentUserRole();
  }

  forceRoleChange(newRole: RoleType) {
    this._currentUserRole.next(newRole);
  }

  getAllUsers(): Observable<UserWithRole[]> {
    return this.advenService.getAll(-1, 100).pipe(
      switchMap(advensResponse => {
        const advens = Array.isArray(advensResponse) ? advensResponse : advensResponse.data;
        
        const usersWithRoles: UserWithRole[] = advens
          .filter(adven => adven.userId && adven.email)
          .map(adven => {
            const userRole = this.getUserRoleFromEmail(adven.email!);
            const role = userRole === 'manager' ? { ...ROLES.MANAGER } : { ...ROLES.USER };
            
            return {
              id: adven.userId!,
              username: `${adven.name} ${adven.surname}`,
              email: adven.email!,
              role: role,
              isActive: true,
              createdAt: adven.createdAt,
              updatedAt: adven.updatedAt
            };
          });

        this._users.next(usersWithRoles);
        return of(usersWithRoles);
      })
    );
  }

  deleteUserCompletely(userId: string): Observable<boolean> {
    return this.advenService.getByUserId(userId).pipe(
      switchMap(adven => {
        if (!adven) {
          throw new Error('Usuario no encontrado');
        }

        return this.activitiesService.getAllActivitiesByAdvenId(adven.id).pipe(
          switchMap(activities => {
            const deleteActivities$ = activities.length > 0 
              ? forkJoin(activities.map(activity => this.activitiesService.delete(activity.id)))
              : of([]);

            return deleteActivities$.pipe(
              switchMap(() => {
                return this.advenService.delete(adven.id);
              }),
              map(() => true),
              tap(() => {
                this.getAllUsers().subscribe();
              })
            );
          })
        );
      })
    );
  }

  changeUserRole(userId: string, newRole: RoleType): Observable<boolean> {
    return of(true);
  }

  deactivateUser(userId: string): Observable<boolean> {
    return of(true);
  }
}