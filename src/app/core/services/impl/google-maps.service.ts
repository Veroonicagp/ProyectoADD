import { Injectable } from '@angular/core';
import { Activity } from '../../models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  private apiKey = 'AIzaSyACJQoppvQzxXvFTvuc-NhmkcZ--KeUkbM';

  async getActivitiesMapUrl(
    location: string, 
    activities: Activity[], 
    options: {
      zoom?: number;
      size?: string;
      mapType?: 'roadmap' | 'satellite' | 'terrain' | 'hybrid';
    } = {}
  ): Promise<string> {
    const { zoom = 14, size = '600x400', mapType = 'roadmap' } = options;
    
    if (!location?.trim() || !activities?.length) {
      return '';
    }
    
    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap?';
    let params = `center=${encodeURIComponent(location)}&zoom=${zoom}&size=${size}&maptype=${mapType}`;

    activities.forEach((activity, index) => {
      if (!activity?.location) return;

      const markerColor = this.getActivityMarkerColor(activity.price);
      const markerLabel = (index + 1).toString();
      const address = encodeURIComponent(activity.location);
      params += `&markers=color:${markerColor}%7Clabel:${markerLabel}%7C${address}`;
    });

    if (this.apiKey) {
      params += `&key=${this.apiKey}`;
    }
    
    return baseUrl + params;
  }

  async getSingleActivityMapUrl(activity: Activity, zoom: number = 15): Promise<string> {
    if (!activity?.location) {
      return '';
    }

    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap?';
    let params = `center=${encodeURIComponent(activity.location)}&zoom=${zoom}&size=400x300&maptype=roadmap`;
    
    const markerColor = this.getActivityMarkerColor(activity.price);
    params += `&markers=color:${markerColor}%7Clabel:A%7C${encodeURIComponent(activity.location)}`;

    if (this.apiKey) {
      params += `&key=${this.apiKey}`;
    }

    return baseUrl + params;
  }

  getMultiLocationMapUrl(locations: string[]): string {
    if (!locations?.length) return '';

    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap?';
    let params = `zoom=8&size=600x400&maptype=roadmap&center=Andalucía,España`;

    const uniqueLocations = [...new Set(locations)];
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    
    uniqueLocations.forEach((location, index) => {
      const color = colors[index % colors.length];
      const label = String.fromCharCode(65 + index);
      params += `&markers=color:${color}%7Clabel:${label}%7C${encodeURIComponent(location)}`;
    });

    if (this.apiKey) {
      params += `&key=${this.apiKey}`;
    }

    return baseUrl + params;
  }

  getDirectionsUrl(destination: string): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  }

  getSearchUrl(query: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  private getActivityMarkerColor(price: string): string {
    const priceNumber = this.extractPriceNumber(price);
    
    if (priceNumber === 0) return 'green';
    if (priceNumber < 10) return 'blue';
    if (priceNumber < 20) return 'yellow';
    if (priceNumber < 50) return 'orange';
    if (priceNumber < 100) return 'red';
    return 'purple';
  }

  private extractPriceNumber(price: string): number {
    if (!price || price.toLowerCase().includes('gratis') || price.toLowerCase().includes('free')) {
      return 0;
    }
    
    const match = price.match(/\d+/);
    return match ? parseInt(match[0]) : 50;
  }
}