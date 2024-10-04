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
  public olympicSubscription!: Subscription;
  public olympics$ : Observable <Olympic[]>  = of([]);
  public participationData !:Participation[];
  private routeSubscription!: Subscription; 
  public selectedCountry: string = '';


  public countriesNumber: number = 0;
  constructor(private olympicService: OlympicService , private route: ActivatedRoute){}

 

  ngOnInit(): void {
    this.routeSubscription=this.route.params.subscribe(urlParams=>{
      this.selectedCountry=urlParams['country'];
    })


    this.olympics$ = this.olympicService.getOlympics();
    this.olympicSubscription = this.olympics$.subscribe({
      next: (data:Olympic[]) => {
        if (data && data.length > 0){
          this.countriesNumber = data.length;
        } 

    }});
  
  
    
  }

  ngOnDestroy(): void{
    this.olympicSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    
  }

}
