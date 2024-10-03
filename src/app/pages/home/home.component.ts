import { Component, OnInit } from '@angular/core';
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
  public countryVersusTotalsMedals :{ [country: string]:number} = {};
  public countrysVersusTotalsMedalsPieChartFormat: { name: string; value: number }[] = [];


  // options Pie chart
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  view: [number, number] = [700, 500];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.loadingOlympicData = true; //Data loading begins
    this.olympics$ = this.olympicService.getOlympics();
    this.olympicSubscription = this.olympics$.subscribe({
      next: (data:Olympic[]) => {
        this.loadingOlympicData = false; //Data loading has finished
        if (data && data.length > 0){
          this.countriesNumber = data.length;
          this.joNumber = data.flatMap(country => country.participations ).length/this.countriesNumber
          data.forEach(countryBloc => {
            let totalMedalsByCountry:number = countryBloc.participations.reduce((total: number , countryParticipation) => {
              return total + countryParticipation.medalsCount;}, 0);
            this.countryVersusTotalsMedals[countryBloc.country] =totalMedalsByCountry
            this.countrysVersusTotalsMedalsPieChartFormat=Object.entries(this.countryVersusTotalsMedals).map(([name,value])=>({name,value}));
          })
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
