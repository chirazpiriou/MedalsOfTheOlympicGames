import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  /**initialization with an Observable that outputs an empty array,
  allows my observable to always have a defined value, even before real data is loaded.*/
  public olympics$ : Observable <Olympic[]>  = of([]);
  public olympicSubscription!: Subscription;
  public loadingOlympicData=false;
  public loadError=false;
  public countriesNumber: number = 0;
  public joNumber: number = 0;
  public countrysVersusTotalsMedalsPieChartFormat: { name: string, value: number ,  extra:{id:number} }[] = [];



  // options Pie Chart
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  view: [number, number] = [700, 500];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  constructor(private olympicService: OlympicService , public router : Router) {}

  /** Navigates to a details page based on the selected country id .
   * This method uses router.navigateByUrl to redirect the user to a country-specific details page,
   * using the country's id in the URL. For example, if the country id is 1 , the user will
   * be redirected to `detail/2` and have the informations about france.*/

   selectedCountryId(event:{ name: string, value: number ,  extra:{id:number} }):void {
    console.log(event)
    this.router.navigateByUrl('detail/'+ event.extra.id)
  }


  ngOnInit(): void {
    this.loadingOlympicData = true; //Data loading begins
    this.olympics$ = this.olympicService.getOlympics();
    this.olympicSubscription = this.olympics$.subscribe({
      next: (data:Olympic[]) => {
        this.loadingOlympicData = false; //Data loading has finished
        if (data && data.length > 0){
          this.countriesNumber = data.length;
          this.joNumber = data.flatMap(country => country.participations ).length/this.countriesNumber
          this.countrysVersusTotalsMedalsPieChartFormat = data.map(country => ({
            name: country.country,
            value: country.participations.reduce((total, participation) => total + participation.medalsCount, 0),
            extra:{id:country.id}
          }));
        } else {
          this.loadError = true; //no data available
        }
      },
      error: (error) =>{
        this.loadingOlympicData=false;
        this.loadError = true;
        console.error("Error when subscribing to Olympic data",error)
      },
      complete: () => {
        console.log('Data loading complete');
      }
    });
  }
  ngOnDestroy() : void {
    this.olympicSubscription.unsubscribe();
  }
}
