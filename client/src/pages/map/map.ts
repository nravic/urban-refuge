import { Component, ViewChild } from '@angular/core';
import { NavParams, Slides } from 'ionic-angular';
import { FilterProvider } from '../../providers/filter/filter';
// import * as L from 'leaflet'
import L from 'leaflet'
import 'leaflet.markercluster';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('slider') slider: Slides;
  selectedResource: string = '';
  map: any = null;
  markers: any = null;

  constructor(private filterProvider: FilterProvider, public navParams: NavParams) {
    this.selectedResource = navParams.data;
  }

  ionViewDidLoad() {
    this.map = L.map('map').setView([41.0131, 28.9641], 18);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 18
    }).addTo(this.map);
    this.markers = L.markerClusterGroup({
      spiderLegPolylineOptions: {
        weight: 1.5,
        color: '#0F144C',
        opacity: .5
      }
    });
    this.getResource(this.selectedResource);
  }

  ionViewDidEnter() {
    if (this.selectedResource == 'Cash' || this.selectedResource == 'Health' || this.selectedResource == 'Other') {
      this.slider.slideNext();
    }
  }

  getResource(resource) {
    this.selectedResource = resource;
    this.markers.clearLayers();
    this.filterProvider.getData(resource).subscribe(data => {
      var mIcon = L.icon({
        iconUrl: 'assets/map/' + resource.toLowerCase() +'.png',
        iconAnchor: [20, 20]
      });
      data.elements.forEach(element => {
        this.markers.addLayer(L.marker(L.latLng(element.lat, element.lon), {
          icon: mIcon
        }).bindPopup(JSON.stringify(element.tags)));
      });
      this.map.addLayer(this.markers);
    });
  }

}
