export class CoordinatesModel {
    lat: number | null;
    long: number | null;

    constructor(data?: any) {
        this.lat = data?.lat;
        this.long = data?.long;
    }
}