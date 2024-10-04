import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';

import { Participation } from 'src/app/core/models/Participation';

import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit{
  public olympic$ : Observable <Olympic>  = of();
  public participationSubscription!: Subscription;
  public participationData !:Participation[];
  private routeSubscription!: Subscription; 
  public selectedCountryId: number = 0;
  public totalNumberOfENtries:number=0;
  public totalNumberMedals:number=0;
  public totalNumberOfAthletes:number=0;
  public countryVersusMedalsPerYear:{[id:number]:{year: number,medalsCount: number}[]}={};
  public countrysVersusMedalsPerYearLineChartFormat: { name: string; series: {value:number,name:string}[] }[] = [];
  public countryName !: string;

   // options Line chart
   legend: boolean = false;
   showLabels: boolean = true;
   animations: boolean = true;
   xAxis: boolean = true;
   yAxis: boolean = true;
   showYAxisLabel: boolean = true;
   showXAxisLabel: boolean = true;
   xAxisLabel: string = 'Year';
   yAxisLabel: string = 'Population';
   timeline: boolean = true;
   view: [number, number] = [800, 300];
   colorScheme = {
     domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
   };

  constructor(private olympicService: OlympicService , private route: ActivatedRoute){}

  /**This function is called when the window resize event occurs. It retrieves the target of the event, which is the browser window (Window)
   * It updates the "view" property of the current object (this).*/

  onResize(event:UIEvent) {
    const target = event.target as Window;
    this.view = [target.innerWidth / 1.35, 400];
  }

 

  ngOnInit(): void {

    /** Subscribe to the route parameters to track changes in the URL. Retrieve the country parameter from the URL.
     * At this point, this.selectedCountryId will contain the name of the selected country based on what was specified in the URL */
    this.routeSubscription=this.route.params.subscribe(urlParams=>{
      this.selectedCountryId=parseInt(urlParams['id'], 10);
    })


    this.olympic$ = this.olympicService.getOlympicsCountryByCountryId(this.selectedCountryId);
    this.participationSubscription = this.olympic$.subscribe({
      next: (data:Olympic) => {
        if (data && data.participations.length > 0){
          this.participationData = data.participations
          this.totalNumberOfENtries = this.participationData.length;
          this.countryName = data.country;
          let NumberMedalsCount : number = this.participationData.reduce(
            (total:number ,countryNumberMedals )=>
            {return total+countryNumberMedals.medalsCount;},0);
            this.totalNumberMedals = NumberMedalsCount;

          let NumberAthletesCount : number = this.participationData.reduce(
            (total:number ,countryNumberAthletes )=>
            {return total+countryNumberAthletes.athleteCount;},0);
            this.totalNumberOfAthletes = NumberAthletesCount ;

          this.countryVersusMedalsPerYear[this.selectedCountryId] = [];
          this.participationData.forEach(participation=>{
            this.countryVersusMedalsPerYear[this.selectedCountryId].push(
              {year:participation.year,
              medalsCount:participation.medalsCount
              });})
            /** Transforms the `countryVersusMedalsPerYear` object into a format suitable for ngx-Charts "line chart".
             * Each entry in the output array contains:
             * - `name`: The name of the country.
             * - `series`: An array of objects, where each object represents a year's medal data:
             * - `value`: The number of medals won.
             * - `name`: The year of participation as a string.
             * This format enables easy visualization of medal counts over the years for each country.*/
            this.countrysVersusMedalsPerYearLineChartFormat=Object.entries(this.countryVersusMedalsPerYear).map(([name,series])=>{
              return {
                name,
                series:series.map(participation=>({
                  value:participation.medalsCount,
                  name:participation.year.toString()
                }))
              };
       
            });

        } 
    }});
  
  
    
  }

  ngOnDestroy(): void{
    this.participationSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    
  }

}
