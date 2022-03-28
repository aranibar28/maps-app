import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarkerColor {
  color: string;
  marker?: mapboxgl.Marker;
  center?: [number, number];
}

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.scss'],
})
export class MarkersComponent implements AfterViewInit {
  @ViewChild('map') divMap!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-77.05382221409327, -11.99187478590581];

  // Arreglo de marcadores
  markers: MarkerColor[] = [];

  constructor() {}

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
    });

    this.readLocalStorage();
    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hola mundo';
    // new mapboxgl.Marker({ element: markerHtml }).setLngLat(this.center).addTo(this.map);
    // new mapboxgl.Marker().setLngLat(this.center).addTo(this.map);
  }

  addMarker() {
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );
    const newMarker = new mapboxgl.Marker({ draggable: true, color: color })
      .setLngLat(this.center)
      .addTo(this.map);

    this.markers.push({
      color,
      marker: newMarker,
    });
    this.saveMarkerLocalStorage();
    newMarker.on('dragend', () => {
      this.saveMarkerLocalStorage();
    });
  }

  goMarker(marker: any) {
    this.map.flyTo({
      center: marker.getLngLat(),
    });
  }

  saveMarkerLocalStorage() {
    const lngLatArr: MarkerColor[] = [];
    this.markers.forEach((m) => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();
      lngLatArr.push({
        color: color,
        center: [lng, lat],
      });
    });
    localStorage.setItem('markers', JSON.stringify(lngLatArr));
  }

  readLocalStorage() {
    if (!localStorage.getItem('markers')) {
      return;
    }
    const lngLatArr: MarkerColor[] = JSON.parse(
      localStorage.getItem('markers')!
    );
    lngLatArr.forEach((m) => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true,
      })
        .setLngLat(m.center!)
        .addTo(this.map);

      this.markers.push({
        marker: newMarker,
        color: m.color,
      });

      newMarker.on('dragend', () => {
        this.saveMarkerLocalStorage();
      });
    });
  }

  deleteMarker(i: number) {
    this.markers[i].marker?.remove();
    this.markers.splice(i, 1);
    this.saveMarkerLocalStorage();
  }
}
