import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  constructor(private olympicService: OlympicService){}

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void{
    
  }


}
