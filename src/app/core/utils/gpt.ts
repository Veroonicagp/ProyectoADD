import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  private apiUrl = 'http://localhost:1337/api/actividades';

  constructor(private http: HttpClient) {}

  getActividadesPorPersona(personaId: string) {
    return this.http.get<any[]>(`${this.apiUrl}?filters[persona][id][$eq]=${personaId}&populate=*`);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActividadesService } from './actividades.service';

@Component({
  selector: 'app-mis-actividades',
  templateUrl: './mis-actividades.component.html'
})
export class MisActividadesComponent implements OnInit {
  actividades: any[] = [];
  personaId: string = '1'; // Cambia esto por el ID dinámico de la persona actual.

  constructor(private actividadesService: ActividadesService) {}

  ngOnInit(): void {
    this.actividadesService.getActividadesPorPersona(this.personaId).subscribe((data) => {
      this.actividades = data;
    });
  }
}
