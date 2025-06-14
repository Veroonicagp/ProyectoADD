export interface UserRole {
    id: string;
    name: string;
    permissions: string[];
  }
  
  export interface UserWithRole {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  
  // Tipos de permisos disponibles
  export type Permission = 
    | 'read_activities' 
    | 'create_activities' 
    | 'edit_own_activities' 
    | 'delete_own_activities'
    | 'read_users'
    | 'delete_users'
    | 'manage_users';
  
  // Roles predefinidos
  export const ROLES = {
    USER: {
      id: 'user',
      name: 'Usuario',
      permissions: ['read_activities', 'create_activities', 'edit_own_activities', 'delete_own_activities'] as string[]
    },
    MANAGER: {
      id: 'manager',
      name: 'Gestor',
      permissions: [
        'read_activities', 
        'create_activities', 
        'edit_own_activities', 
        'delete_own_activities',
        'read_users',
        'delete_users',
        'manage_users'
      ] as string[]
    }
  } as const;
  
  export type RoleType = 'user' | 'manager';