import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

    geocoder: google.maps.Geocoder = new google.maps.Geocoder();
    autocomplete: google.maps.places.AutocompleteService = new google.maps.places.AutocompleteService();

    /**
     * Reverse geocoding by location.
     *
     * Wraps the Google Maps API geocoding service into an observable.
     *
     * @param latLng Location
     * @return An observable of GeocoderResult
     */
    getLocationFromCoordinates(latLng: google.maps.LatLng): Observable<google.maps.GeocoderResult[] | null> {
        return new Observable((observer: Observer<google.maps.GeocoderResult[] | null>) => {
            // Invokes geocode method of Google Maps API geocoding.
            this.geocoder.geocode({ location: latLng }, (
                (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        observer.next(results);
                        observer.complete();
                    } else {
                        console.error('Geocoding service: geocoder failed due to: ' + status);
                        observer.error(status);
                    }
                })
            );
        });
    }

    /**
     * Geocoding service.
     *
     * Wraps the Google Maps API geocoding service into an observable.
     *
     * @param address The address to be searched
     * @return An observable of GeocoderResult
     */
    codeAddress(address: string): Observable<google.maps.GeocoderResult[] | null> {
        return new Observable((observer: Observer<google.maps.GeocoderResult[] | null>) => {
            // Invokes geocode method of Google Maps API geocoding.
            this.geocoder.geocode({ address: address }, (
                (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        // console.log('codeAddress:', results);
                        observer.next(results);
                        observer.complete();
                    } else {
                        console.error(
                            'Geocoding service: geocode was not successful for the following reason: '
                            + status
                        );
                        observer.error(status);
                    }
                })
            );
        });
    }

    getPlaces(text: string) {
        return new Observable((observer: Observer<google.maps.places.AutocompletePrediction[] | null>) => {
            this.autocomplete.getPlacePredictions({ input: text }, (
                (results: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        // console.log('getPlaces:', results);
                        observer.next(results);
                        observer.complete();
                    } else {
                        console.error(
                            'Geocoding service: getPlacePredictions was not successful for the following reason: '
                            + status
                        );
                        observer.error(status);
                    }
                })
            );
        });
    }
}
