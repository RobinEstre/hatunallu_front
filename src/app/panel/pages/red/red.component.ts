import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-red',
  templateUrl: './red.component.html',
  styleUrls: ['./red.component.scss']
})
export class RedComponent implements OnInit {  
  data:any;

  ngOnInit(){
    d3.json(
      "https://gist.githubusercontent.com/bumbeishvili/dc0d47bc95ef359fdc75b63cd65edaf2/raw/c33a3a1ef4ba927e3e92b81600c8c6ada345c64b/orgChart.json"
    ).then(data => {
        this.data = data;
    });
  }
}