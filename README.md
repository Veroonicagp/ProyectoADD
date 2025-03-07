# 🟣 ReadyToEnjoy 🟣

## 📱 Descripción 
[VIDEO PRESENTACIÓN](https://youtu.be/qk9j1a6kMvs)

ReadyToEnjoy es una aplicación social para compartir y descubrir actividades. Los usuarios pueden registrarse, iniciar sesión, explorar actividades creadas por otros usuarios y publicar sus propias actividades para que la comunidad las disfrute.

## ✨ Características principales
- **Sistema de autenticación**: Registro e inicio de sesión de usuarios con Firebase Auth
- **Feed de actividades**: Explora actividades compartidas por toda la comunidad
- **Creación de actividades**: Publica tus propias ideas y planes
- **Gestión de perfil**: Visualiza y administra tus actividades publicadas
- **Captura de imágenes**: Toma fotos para tus actividades con Capacitor Camera
- **Modo offline**: Sincronización de datos cuando vuelve la conexión
- **Notificaciones push**: Recibe alertas sobre nuevas actividades de interés

## 🛠️ Tecnologías utilizadas
- **Angular**: Framework principal para el desarrollo frontend
- **TypeScript**: Lenguaje de programación
- **Ionic Framework**: UI components y navegación multiplataforma
- **Capacitor**: APIs nativas para acceso a funcionalidades del dispositivo
- **Firebase**:
  - **Authentication**: Gestión segura de usuarios
  - **Firestore**: Base de datos NoSQL en la nube
  - **Storage**: Almacenamiento de imágenes y archivos
  - **Cloud Functions**: Procesamiento en servidor

## 🏗️ Arquitectura
La aplicación sigue una arquitectura modular basada en:

- **Presentación**: 
  - Components, Pages y Services de Angular/Ionic
  - Gestión de estado con Servicios 

- **Dominio**: 
  - Modelos de datos e interfaces
  - Servicios core de lógica de negocio

- **Datos**: 
  - Implementación del patrón Repositorio
  - Fuentes de datos (Firebase y almacenamiento local)
  - Gestión de suscripciones con RxJS

## 🔄 Patrón Repositorio
La aplicación implementa el patrón repositorio para separar la lógica de acceso a datos:

- **Interfaces de repositorio**: Definen los contratos para las operaciones CRUD
- **Implementaciones de repositorio**: Gestionan conexiones con Firebase y almacenamiento local
- **Mapeadores**: Convierten entre modelos de dominio y entidades de Firebase

## 🌐 Demo

Puedes acceder a la versión desplegada de la aplicación en:
[https://resplendent-pegasus-409be3.netlify.app/](https://resplendent-pegasus-409be3.netlify.app/)

## 🚀 Instalación

1. Clona este repositorio
   ```
   git clone https://github.com/tuusuario/ReadyToEnjoy
   ```

2. Instala las dependencias
   ```
   npm install
   ```

3. Configura Firebase
   - Crea un proyecto en Firebase Console
   - Añade la configuración en environment.ts

4. Ejecuta la aplicación en desarrollo
   ```
   ionic serve
   ```

5. Para compilar para Android/iOS
   ```
   ionic build
   npx cap add android
   npx cap add ios
   npx cap sync
   ```

## 🔥 Configuración de Firebase
La aplicación requiere la siguiente configuración en Firebase:

- Authentication con email/password 
- Firestore con colecciones para usuarios y actividades
- Storage con reglas para imágenes de actividades
- Reglas de seguridad adecuadas para proteger los datos

## 📞 Contacto
Para cualquier pregunta o sugerencia, contáctame en GitHub: [Veroonicagp](https://github.com/Veroonicagp)

---

<p align="center">
  <b>Ready To Enjoy</b> - ¡Comparte y descubre experiencias únicas!
</p>
