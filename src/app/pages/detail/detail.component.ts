import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit{



  constructor(private olympicService: OlympicService){}

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void{
    
  }

}
