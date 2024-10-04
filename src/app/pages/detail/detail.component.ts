import { Component, OnInit } from '@angular/core';
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
  public participation$ : Observable <Participation[]>  = of([]);
  public participationSubscription!: Subscription;
  public participationData !:Participation[];
  private routeSubscription!: Subscription; 
  public selectedCountry: string = '';
  public totalNumberOfENtries:number=0;
  public totalNumberMedals:number=0;
  public totalNumberOfAthletes:number=0;


  constructor(private olympicService: OlympicService , private route: ActivatedRoute){}

 

  ngOnInit(): void {

    /** Subscribe to the route parameters to track changes in the URL. Retrieve the country parameter from the URL.
     * At this point, this.selectedCountry will contain the name of the selected country based on what was specified in the URL */
    this.routeSubscription=this.route.params.subscribe(urlParams=>{
      this.selectedCountry=urlParams['country'];
    })


    this.participation$ = this.olympicService.getOlympicsCountryByCountryName(this.selectedCountry);
    this.participationSubscription = this.participation$.subscribe({
      next: (data:Participation[]) => {
        if (data && data.length > 0){
          this.participationData = data
          this.totalNumberOfENtries=data.length;
          
          let NumberMedalsCount : number =data.reduce(
            (total:number ,countryNumberMedals )=>
            {return total+countryNumberMedals.medalsCount;},0);
            this.totalNumberMedals = NumberMedalsCount;

            let NumberAthletesCount : number =data.reduce(
              (total:number ,countryNumberAthletes )=>
              {return total+countryNumberAthletes.athleteCount;},0);
              this.totalNumberOfAthletes = NumberAthletesCount ;

        } 

    }});
  
  
    
  }

  ngOnDestroy(): void{
    this.participationSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    
  }

}
