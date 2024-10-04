import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Participation } from '../models/Participation';


@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  //I define my subject and initialize it with an empty array, then my subject will receive array values of Olympic objects.
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}
   /**
   * The loadInitialData() method loads the initial data for Olympic events from a JSON file.
   * the method returns an Observable which outputs an array of type Olympic.
   * This method performs an HTTP GET request to retrieve an array of objects of type <Olympic[]> from the “olympic.json” file.
   * If there is an error during data retrieval, an empty array is output to indicate that data loading has failed.
   * This function runs when subscribe() is called */

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => {
        if(Array.isArray(value)){
          this.olympics$.next(value);
        } else {
          //detecting format errors
          throw new Error ("Data received does not have the expected format");
        }
      }),
      catchError((error:HttpErrorResponse) => {
        let errorMessage = 'An error has occurred';
        //Error type identification
        if (error.error instanceof ErrorEvent) {
          errorMessage=`network error: ${error.error.message}`
        } else {
          switch (error.status) {
            case 404:
              errorMessage='Error 404 => The requested resource was not found';
              break;
            case 500:
              errorMessage='Error 500 => Internal server error';
              break;
            case 403:
              errorMessage='Error 403 => Access forbidden.';
              break;
            default:
              errorMessage=`Error ${error.status}: ${error.error.message}`;
          }
        }
        console.error(errorMessage);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return of([]);
      })
    );
  }

  /**This method is used to obtain the Olympics$ Observable, which contains the current data no longer
   * needing to go through the loadInitialData(). This allows your component to react to data changes without having to worry
   * about initialization. It accesses existing data. */

  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }


  /**
 * The getOlympicsCountryByCountryName function retrieves the participation data
 * for a specific country, identified by its ID.
 * It returns an observable that emits an array of Participation objects.*/
  getOlympicsCountryByCountryName(countryName :string): Observable<Participation[]> {
    return this.olympics$.asObservable().pipe(
      map(countries  => {
        const  countryDetails = countries.find(x => x.country.toLowerCase() === countryName.toLowerCase() );
        if (!countryDetails){
          throw new Error (`No country found for ID: ${countryName}`);
        }
        return countryDetails.participations;
    }),
      catchError(error => {
        console.error(error);
        return of([]);

      })
  );
  }
}
