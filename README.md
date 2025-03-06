ReadyToEnjoy
ReadyToEnjoy - Vista previa
🌐 Demo en vivo
Descripción
ReadyToEnjoy es una aplicación móvil y web desarrollada con Angular, Ionic y Capacitor que permite a los usuarios compartir y gestionar actividades sociales. Los usuarios pueden registrarse, iniciar sesión, crear actividades, ver actividades de otros usuarios y gestionar sus propias publicaciones.
Funcionalidades principales
Autenticación

Registro de usuario
Inicio de sesión
Cierre de sesión

Actividades

Visualización de actividades de todos los usuarios
Creación de nuevas actividades
Edición de actividades propias
Eliminación de actividades propias

Perfil

Visualización de información de usuario
Edición de datos personales

Navegación

Feed principal de actividades
Sección "Mis Actividades"
Sección "About"
Perfil de usuario

Tecnologías utilizadas

Frontend:

Angular
Ionic Framework
Capacitor (para compilación nativa)


Backend y almacenamiento:

Firebase (npm install firebase)
Firebase Authentication
Firebase Firestore (base de datos)
Firebase Storage (almacenamiento de archivos)


Arquitectura:

Patrón Repositorio
Servicios Reactivos (RxJS)
Gestión de estado con observables

Prerrequisitos

Node.js (v14.x o superior)
npm (v6.x o superior)
Angular CLI
Ionic CLI

Pasos de instalación

Clonar el repositorio
bashCopygit clone [url-del-repositorio]
cd [nombre-del-directorio]

Instalar dependencias
bashCopynpm install

Configurar Firebase

Crear un proyecto en Firebase Console
Habilitar Authentication, Firestore y Storage
Instalar Firebase:
bashCopynpm install firebase

Copiar las credenciales de configuración
Añadir las credenciales en environments/environment.ts
Inicializar Firebase en tu aplicación según la documentación oficial


Iniciar servidor de desarrollo
bashCopyionic serve


Compilación para plataformas nativas

Añadir plataformas
bashCopyionic cap add android
ionic cap add ios

Compilar el proyecto
bashCopyionic cap build android
ionic cap build ios


Uso de la aplicación

Registro/Login: Crear una cuenta o iniciar sesión con credenciales existentes
Explorar actividades: Navegar por el feed principal para ver actividades compartidas
Crear actividad: Utilizar el botón "+" para añadir una nueva actividad
Gestionar actividades: Acceder a "Mis Actividades" para editar o eliminar tus publicaciones
Perfil: Actualizar información personal desde la sección de perfil

Implementación del patrón repositorio
La aplicación implementa el patrón repositorio para abstraer la lógica de acceso a datos:
typescriptCopy// Ejemplo simplificado del repositorio de actividades
export class ActivityRepository {
  private db: any;
  
  constructor() {
    this.db = getFirestore();
  }

  getAll(): Observable<Activity[]> {
    return new Observable(observer => {
      const q = query(collection(this.db, 'activities'));
      onSnapshot(q, (querySnapshot) => {
        const activities = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Activity[];
        observer.next(activities);
      });
    });
  }

  getByUser(userId: string): Observable<Activity[]> {
    return new Observable(observer => {
      const q = query(
        collection(this.db, 'activities'),
        where('userId', '==', userId)
      );
      onSnapshot(q, (querySnapshot) => {
        const activities = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Activity[];
        observer.next(activities);
      });
    });
  }

  // Otros métodos: add, update, delete...
}
Gestión de estado con observables (RxJS)
El proyecto utiliza RxJS para la gestión reactiva del estado:
typescriptCopyexport class ActivityService {
  private activitiesSubject = new BehaviorSubject<Activity[]>([]);
  activities$ = this.activitiesSubject.asObservable();

  constructor(private activityRepo: ActivityRepository) {
    this.loadActivities();
  }

  private loadActivities() {
    // Usando el repositorio con Firebase directamente (npm install firebase)
    this.activityRepo.getAll().pipe(
      tap(activities => this.activitiesSubject.next(activities))
    ).subscribe();
  }

  // Otros métodos y operadores...
}
Roadmap (Futuras implementaciones)

Sistema de comentarios para actividades
Notificaciones push
Geolocalización de actividades
Búsqueda y filtrado avanzado
Mejoras de rendimiento y UI/UX
Modo offline

Contribución
Si deseas contribuir al proyecto, por favor:

Haz fork del repositorio
Crea una rama para tu feature (git checkout -b feature/nueva-caracteristica)
Realiza tus cambios y haz commit (git commit -m 'Añadir nueva característica')
Haz push a la rama (git push origin feature/nueva-caracteristica)
Abre un Pull Request

Contacto
Para cualquier pregunta o sugerencia, contáctame en GitHub: [Veroonicagp](https://github.com/Veroonicagp)
