import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RequestHandlerService {

    constructor(private http: HttpClient) { }

    sendGetRequest(url: string, requestData: any) {
        return this.http.get<any>(url)
            .pipe(
                tap({
                    next(data) {
                        return data;
                    },
                    error(err) {
                        return throwError(() => new Error(err));
                    },
                })
            );
    }

    sendPostRequest(url: string, requestData: any) {
        return this.http.post<any>(url, requestData)
            .pipe(
                tap({
                    next(data) {
                        return data;
                    },
                    error(err) {
                        return throwError(() => new Error(err));
                    },
                })
            );
    }


    sendPutRequest(url: string, requestData: any) {
        return this.http.put<any>(url, requestData)
            .pipe(
                tap({
                    next(data) {
                        return data;
                    },
                    error(err) {
                        return throwError(() => new Error(err));
                    },
                })
            );
    }

    sendPatchRequest(url: string, requestData: any) {
        return this.http.patch<any>(url, requestData)
            .pipe(
                tap({
                    next(data) {
                        return data;
                    },
                    error(err) {
                        return throwError(() => new Error(err));
                    },
                })
            );
    }

    sendDeleteRequest(url: string) {
        return this.http.delete<any>(url)
            .pipe(
                tap({
                    next(data) {
                        return data;
                    },
                    error(err) {
                        return throwError(() => new Error(err));
                    },
                })
            );
    }
}
