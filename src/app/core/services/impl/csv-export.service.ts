import { Injectable } from '@angular/core';
import { Observable, from, forkJoin } from 'rxjs';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ActivitiesService } from './activities.service';
import { AdvenService } from './adven.service';
import { Activity } from '../../models/activity.model';
import { Adven } from '../../models/adven.model';

export interface ExportData {
  filename: string;
  data: any[];
  headers: string[];
}

export interface ExportOptions {
  includeUsers: boolean;
  includeActivities: boolean;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  format: 'csv' | 'json';
}

@Injectable({
  providedIn: 'root'
})
export class CsvExportService {

  constructor(
    private activitiesService: ActivitiesService,
    private advenService: AdvenService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private translate: TranslateService
  ) { }

  async exportUsers(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Exportando aventureros...',
      spinner: 'circular'
    });
    await loading.present();

    try {
      this.advenService.getAll(1, 1000).subscribe({
        next: (response) => {
          const users = response.data || response;
          const csvData = this.processUsersForExport(users);
          this.downloadCSV(csvData, 'aventureros_readytoenjoy');
          loading.dismiss();
          this.showSuccessToast('Aventureros exportados exitosamente');
        },
        error: (error) => {
          console.error('Error exportando aventureros:', error);
          loading.dismiss();
          this.showErrorToast('Error al exportar aventureros');
        }
      });
    } catch (error) {
      loading.dismiss();
      this.showErrorToast('Error al exportar aventureros');
    }
  }

  async exportActivities(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Exportando actividades...',
      spinner: 'circular'
    });
    await loading.present();

    try {
      this.activitiesService.getAll(1, 1000).subscribe({
        next: (response) => {
          const activities = response.data || response;
          const csvData = this.processActivitiesForExport(activities);
          this.downloadCSV(csvData, 'actividades_readytoenjoy');
          loading.dismiss();
          this.showSuccessToast('Actividades exportadas exitosamente');
        },
        error: (error) => {
          console.error('Error exportando actividades:', error);
          loading.dismiss();
          this.showErrorToast('Error al exportar actividades');
        }
      });
    } catch (error) {
      loading.dismiss();
      this.showErrorToast('Error al exportar actividades');
    }
  }

  async exportAllData(options: ExportOptions = { 
    includeUsers: true, 
    includeActivities: true, 
    format: 'csv' 
  }): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Exportando todos los datos...',
      spinner: 'circular'
    });
    await loading.present();

    try {
      const exports: Observable<any>[] = [];

      if (options.includeUsers) {
        exports.push(this.advenService.getAll(1, 1000));
      }

      if (options.includeActivities) {
        exports.push(this.activitiesService.getAll(1, 1000));
      }

      forkJoin(exports).subscribe({
        next: (results) => {
          const timestamp = new Date().toISOString().split('T')[0];
          
          if (options.includeUsers && results[0]) {
            const users = results[0].data || results[0];
            const usersCsvData = this.processUsersForExport(users);
            this.downloadCSV(usersCsvData, `aventureros_${timestamp}`);
          }

          if (options.includeActivities) {
            const activitiesIndex = options.includeUsers ? 1 : 0;
            const activities = results[activitiesIndex]?.data || results[activitiesIndex];
            if (activities) {
              const activitiesCsvData = this.processActivitiesForExport(activities);
              this.downloadCSV(activitiesCsvData, `actividades_${timestamp}`);
            }
          }

          loading.dismiss();
          this.showSuccessToast('Datos exportados exitosamente');
        },
        error: (error) => {
          console.error('Error exportando datos:', error);
          loading.dismiss();
          this.showErrorToast('Error al exportar datos');
        }
      });
    } catch (error) {
      loading.dismiss();
      this.showErrorToast('Error al exportar datos');
    }
  }

  private processUsersForExport(users: Adven[]): ExportData {
    const headers = [
      'ID',
      'Nombre',
      'Apellidos', 
      'Email',
      'Nombre Completo',
      'Fecha de Creación',
      'URL de Imagen',
      'Estado'
    ];

    const data = users.map(user => ({
      'ID': user.id || '',
      'Nombre': user.name || '',
      'Apellidos': user.surname || '',
      'Email': user.email || '',
      'Nombre Completo': `${user.name || ''} ${user.surname || ''}`.trim(),
      'Fecha de Creación': user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : '',
      'URL de Imagen': user.media?.url || '',
      'Estado': 'Activo'
    }));

    return {
      filename: 'aventureros_readytoenjoy',
      data,
      headers
    };
  }

  private processActivitiesForExport(activities: Activity[]): ExportData {
    const headers = [
      'ID',
      'Título',
      'Descripción',
      'Ubicación',
      'Precio',
      'Usuario ID',
      'Fecha de Creación',
      'URL de Imagen',
      'Provincia'
    ];

    const data = activities.map(activity => ({
      'ID': activity.id || '',
      'Título': activity.title || '',
      'Descripción': activity.description || '',
      'Ubicación': activity.location || '',
      'Precio': activity.price ? `${activity.price}` : '', 
      'Usuario ID': activity.advenId || '',
      'Fecha de Creación': activity.createdAt ? new Date(activity.createdAt).toLocaleDateString('es-ES') : '',
      'URL de Imagen': activity.media?.url || '',
      'Provincia': this.extractProvince(activity.location || '')
    }));

    return {
      filename: 'actividades_readytoenjoy',
      data,
      headers
    };
  }

  private extractProvince(ubicacion: string): string {
    const parts = ubicacion.split(',');
    return parts.length > 1 ? parts[parts.length - 1].trim() : '';
  }

  private convertToCSV(data: any[], headers: string[]): string {
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header];
        // Escapar comillas y envolver en comillas si contiene comas
        if (value && value.toString().includes(',')) {
          return `"${value.toString().replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
  }

  private downloadCSV(exportData: ExportData, filename?: string): void {
    const csv = this.convertToCSV(exportData.data, exportData.headers);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const finalFilename = filename || exportData.filename;
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${finalFilename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async showExportOptions(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Exportar Datos',
      message: 'Selecciona qué datos deseas exportar:',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Solo Aventureros',
          handler: () => {
            this.exportUsers();
          }
        },
        {
          text: 'Solo Actividades', 
          handler: () => {
            this.exportActivities();
          }
        },
        {
          text: 'Todo',
          handler: () => {
            this.exportAllData();
          }
        }
      ]
    });

    await alert.present();
  }

  async exportWithFilters(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Exportación Avanzada',
      message: 'Próximamente: Filtros por fecha, provincia, etc.',
      buttons: [
        {
          text: 'Entendido',
          role: 'cancel'
        },
        {
          text: 'Exportar Todo',
          handler: () => {
            this.exportAllData();
          }
        }
      ]
    });

    await alert.present();
  }

  private async showSuccessToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'success',
      buttons: [
        {
          text: '✓',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }

  private async showErrorToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 4000,
      position: 'bottom', 
      color: 'danger',
      buttons: [
        {
          text: '✗',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }

  async exportAsJSON(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Exportando como JSON...',
      spinner: 'circular'
    });
    await loading.present();

    try {
      forkJoin([
        this.advenService.getAll(1, 1000),
        this.activitiesService.getAll(1, 1000)
      ]).subscribe({
        next: ([usersResponse, activitiesResponse]) => {
          const users = usersResponse.data || usersResponse;
          const activities = activitiesResponse.data || activitiesResponse;
          
          const jsonData = {
            exportDate: new Date().toISOString(),
            users: users,
            activities: activities,
            summary: {
              totalUsers: users.length,
              totalActivities: activities.length
            }
          };

          this.downloadJSON(jsonData, 'readytoenjoy_export');
          loading.dismiss();
          this.showSuccessToast('Datos exportados como JSON');
        },
        error: (error) => {
          console.error('Error exportando JSON:', error);
          loading.dismiss();
          this.showErrorToast('Error al exportar JSON');
        }
      });
    } catch (error) {
      loading.dismiss();
      this.showErrorToast('Error al exportar JSON');
    }
  }
  
  private downloadJSON(data: any, filename: string): void {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}