import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { OrgChart } from 'd3-org-chart';

@Component({
  selector: 'app-d3-org-chart',
  templateUrl: './d3-org-chart.component.html',
  styleUrls: ['./d3-org-chart.component.scss']
})
export class D3OrgChartComponent implements OnInit, OnChanges {
  @ViewChild("chartContainer") chartContainer: ElementRef;
  @Input() data: any[];
  chart;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (!this.chart) {
      this.chart = new OrgChart();
    }
    this.updateChart();
  }

  ngOnChanges() {
    this.updateChart();
  }

  oClick() {
    this.updateChart();
  }
  
  updateChart() {
    if (!this.data) {
      return; 
    }
    if (!this.chart) {
      return; 
    }
    this.chart
      .container(this.chartContainer.nativeElement)
      .data(this.data)
      .svgWidth(600)
      .initialZoom(1)
      .onNodeClick(d => console.log(d + ' node clicked'))
      .nodeContent(function (d, i, arr, state) {
        //console.log(d)
        return `
          <div style="padding-top:30px;background-color:none;margin-left:1px;height:${
            d.height
          }px;border-radius:2px;overflow:visible">
            <div style="height:${
              d.height - 32
            }px;padding-top:0px;background-color:white;border:1px solid lightgray;">
              <img src=" ${
                d.data.img
              }" style="margin-top:-30px;margin-left:${d.width / 2 - 30}px;border-radius:100px;width:60px;height:60px;" />
              <div style="margin-right:10px;margin-top:15px;float:right">${
                d.data.telefono
              }</div>
              <div style="margin-left:10px;margin-top:-15px;float:left">${
                d.data.dni
              }</div>
            <div style="margin-top:-30px;background-color:${d.data.color};height:10px;width:${
              d.width - 2
            }px;border-radius:1px"></div>
            <div style="padding:20px; padding-top:35px;text-align:center">
                <div style="color:#111672;font-size:16px;font-weight:bold"> <small>${
                  d.data.nombre + ' '+ d.data.apellido
                } </small></div>
                <div style="color:#404040;font-size:16px;margin-top:4px">
                  <small> ${
                  d.data.email
                } </small> </div>
            </div> 
            </div>
          </div>
        `;
      })
      .render();
  }
}
// <div style="display:flex;justify-content:space-between;padding-left:15px;padding-right:15px;">
//   <div > Manages:  ${d.data._directSubordinates} 👤</div>  
//   <div > Oversees: ${d.data._totalSubordinates} 👤</div>    
// </div>
