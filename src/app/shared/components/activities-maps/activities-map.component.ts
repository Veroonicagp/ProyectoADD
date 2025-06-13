import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Activity } from 'src/app/core/models/activity.model';
import { GoogleMapsService } from 'src/app/core/services/impl/google-maps.service';

@Component({
  selector: 'app-activities-map',
  templateUrl: './activities-map.component.html',
  styleUrls: ['./activities-map.component.scss'],
})
export class ActivitiesMapComponent implements OnInit {
  @Input() activities: Activity[] = [];
  @Input() location: string = '';
  @Input() highlightedActivity?: Activity;

  mapUrl: string = '';
  isLoadingMap: boolean = true;
  imageLoaded: boolean = false;
  mapError: string = '';
  selectedActivity?: Activity;
  selectedActivityIndex: number = -1;

  constructor(
    private modalCtrl: ModalController,
    private googleMapsService: GoogleMapsService
  ) {}

  ngOnInit() {
    this.generateMapUrl();
    
    if (this.highlightedActivity) {
      const index = this.activities.findIndex(a => a.id === this.highlightedActivity!.id);
      if (index >= 0) {
        this.selectActivity(this.highlightedActivity, index);
      }
    }
  }

  selectActivity(activity: Activity, index: number) {
    if (this.selectedActivity?.id === activity.id) {
      this.selectedActivity = undefined;
      this.selectedActivityIndex = -1;
    } else {
      this.selectedActivity = activity;
      this.selectedActivityIndex = index;
    }
  }

  getMarkerColor(price: string): string {
    const priceNumber = this.extractPriceNumber(price);
    
    if (priceNumber === 0) return '#4CAF50';
    if (priceNumber < 10) return '#2196F3';
    if (priceNumber < 20) return '#FFEB3B';
    if (priceNumber < 50) return '#FF9800';
    if (priceNumber < 100) return '#F44336';
    return '#9C27B0';
  }

  getPriceColor(price: string): string {
    const priceNumber = this.extractPriceNumber(price);
    if (priceNumber === 0) return 'success';
    if (priceNumber < 20) return 'warning';
    if (priceNumber < 50) return 'primary';
    return 'danger';
  }

  private extractPriceNumber(price: string): number {
    if (!price || price.toLowerCase().includes('gratis')) return 0;
    const match = price.match(/\d+/);
    return match ? parseInt(match[0]) : 50;
  }

  async generateMapUrl() {
    if (!this.activities?.length) {
      this.mapError = 'No hay actividades para mostrar en el mapa';
      this.isLoadingMap = false;
      return;
    }

    if (!this.location?.trim()) {
      this.mapError = 'No se especificó una ubicación válida';
      this.isLoadingMap = false;
      return;
    }

    try {
      const locationToUse = this.location || this.activities[0]?.location || 'España';
      
      this.mapUrl = await this.googleMapsService.getActivitiesMapUrl(
        locationToUse,
        this.activities,
        { 
          zoom: 15, 
          size: '600x200',
          mapType: 'roadmap'
        }
      );

      if (!this.mapUrl || this.mapUrl.length < 10) {
        throw new Error('URL generada inválida');
      }
      
    } catch (error) {
      this.mapError = 'Error generando la URL del mapa';
    } finally {
      this.isLoadingMap = false;
    }
  }

  onMapLoaded() {
    this.imageLoaded = true;
    this.mapError = '';
  }

  onMapError(event: any) {
    this.mapError = 'Error cargando la imagen del mapa';
    this.imageLoaded = false;
    event.target.style.display = 'none';
    event.target.src = '';
    event.preventDefault();
  }

  async retryMap() {
    this.mapError = '';
    this.imageLoaded = false;
    this.isLoadingMap = true;
    this.mapUrl = '';
    
    setTimeout(() => this.generateMapUrl(), 100);
  }

  openDirections(activity: Activity) {
    const directionsUrl = this.googleMapsService.getDirectionsUrl(activity.location);
    window.open(directionsUrl, '_blank');
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}