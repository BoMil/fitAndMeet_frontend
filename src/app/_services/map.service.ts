import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
    // https://github.com/angular/components/blob/main/src/google-maps/README.md
    isMapLoaded!: Observable<boolean>;
    // TODO: Novi Sad by default, it should be user adress or current location
    center: google.maps.LatLngLiteral = { lat: 45.267136, lng: 19.833549 };
    defaultCenter: google.maps.LatLngLiteral = { lat: 45.267136, lng: 19.833549 };
    zoom: number = 13;
    private googleMapsKey: string = 'AIzaSyAFyT4zgN-SD6gCDW-Eug3nIzer3-qbO74';

    constructor(private httpClient: HttpClient) {}

    initializeGoogleMaps() {
        this.isMapLoaded = this.httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${this.googleMapsKey}`, 'callback')
        .pipe(
          map((data) => {
            // console.log('initializeGoogleMaps', data);
            return true;
          }),
          catchError((err) => {
            console.log('initializeGoogleMaps Err', err);

            return of(false)
          }),
        );
    }

    getCurrentLocation() {
        return new Promise<google.maps.LatLngLiteral | null>((resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                if (position) {
                  console.log(
                    'Latitude: ' +
                      position.coords.latitude +
                      'Longitude: ' +
                      position.coords.longitude
                  );
                  let lat = position.coords.latitude;
                  let lng = position.coords.longitude;
    
                  const location: google.maps.LatLngLiteral = { lat: lat, lng: lng };
                  resolve(location);
                }
              },
              (error) => {
                resolve(null);
                console.log(error);
            }
            );
          } else {
            resolve(null);
            reject('Geolocation is not supported by this browser.');
          }
        });
    }  
}
