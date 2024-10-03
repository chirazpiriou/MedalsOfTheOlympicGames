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

  public olympicData!:Olympic[];

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.loadingOlympicData = true; //Data loading begins
    this.olympics$ = this.olympicService.getOlympics();
    this.olympicSubscription = this.olympics$.subscribe({
      next: (data:Olympic[]) => {
        this.loadingOlympicData = false; //Data loading has finished
        if (data && data.length > 0){
          this.olympicData = data;
        } else {
          this.loadError=true; //no data available
        }
      },
      error: (error) =>{
        this.loadingOlympicData=false;
        this.loadError=true;
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
