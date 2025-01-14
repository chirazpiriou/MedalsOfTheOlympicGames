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



  /** Configuration options for the chart component.This class contains various properties that define the appearance and behavior
 * of a chart. These properties allow customization of the chart's display features, such as gradients, legends, labels, and color
 * schemes.*/
  gradient: boolean = false; //Specifies whether a color gradient is to be applied to graph segments.
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false; //Indicates whether to display the chart as a doughnut chart.
  view: [number, number] = [700, 500];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

 // The service OlympicService is injected via the Homecomponent constructor 
  constructor(private olympicService: OlympicService , public router : Router) {}

  /** Navigates to a details page based on the selected country id .
   * This method uses router.navigateByUrl to redirect the user to a country-specific details page,
   * using the country's id in the URL. For example, if the country id is 2 , the user will
   * be redirected to `detail/2` and have the informations about Spain.*/

  selectedCountryId(event:{ name: string, value: number ,  extra:{id:number} }):void {
    this.router.navigateByUrl('detail/'+ event.extra.id)
  }
   /**This function is called when the window resize event occurs. It retrieves the target of the event, which is the browser window (Window)
   * It updates the "view" property of the current object (this).*/
  
  onResize(event:UIEvent) {
    const target = event.target as Window;
    this.view = [target.innerWidth / 1, 400];
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
