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
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-red',
  templateUrl: './red.component.html',
  styleUrls: ['./red.component.scss']
})
export class RedComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService,private service: GeneralService) { 
  }

  data:any=null;

  ngOnInit(){
    // d3.json(
    //   "https://gist.githubusercontent.com/bumbeishvili/dc0d47bc95ef359fdc75b63cd65edaf2/raw/c33a3a1ef4ba927e3e92b81600c8c6ada345c64b/orgChart.json"
    // ).then(data => {
    //   // this.data = [{
    //   //   "nodeId": "O-1",
    //   //   "parentNodeId": null,
    //   //   "width": 342,
    //   //   "height": 146,
    //   //   "borderWidth": 1,
    //   //   "borderRadius": 5,
    //   //   "borderColor": {
    //   //     "red": 15,
    //   //     "green": 140,
    //   //     "blue": 121,
    //   //     "alpha": 1
    //   //   },
    //   //   "backgroundColor": {
    //   //     "red": 51,
    //   //     "green": 182,
    //   //     "blue": 208,
    //   //     "alpha": 1
    //   //   },
    //   //   "nodeImage": {
    //   //     "url": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/cto.jpg",
    //   //     "width": 100,
    //   //     "height": 100,
    //   //     "centerTopDistance": 0,
    //   //     "centerLeftDistance": 0,
    //   //     "cornerShape": "CIRCLE",
    //   //     "shadow": false,
    //   //     "borderWidth": 0,
    //   //     "borderColor": {
    //   //     "red": 19,
    //   //     "green": 123,
    //   //     "blue": 128,
    //   //     "alpha": 1
    //   //   }
    //   //   },
    //   //   "nodeIcon": {
    //   //   "icon": "https://to.ly/1yZnX",
    //   //   "size": 30
    //   //   },
    //   //   "template": "<div>\n                  <div style=\"margin-left:70px;\n                              margin-top:10px;\n                              font-size:20px;\n                              font-weight:bold;\n                         \">Ian Devling </div>\n                 <div style=\"margin-left:70px;\n                              margin-top:3px;\n                              font-size:16px;\n                         \">Cheaf Executive Officer  </div>\n\n                 <div style=\"margin-left:70px;\n                              margin-top:3px;\n                              font-size:14px;\n                         \">Business first</div>\n\n                 <div style=\"margin-left:196px;\n                             margin-top:15px;\n                             font-size:13px;\n                             position:absolute;\n                             bottom:5px;\n                            \">\n                      <div>CTO office</div>\n                      <div style=\"margin-top:5px\">Corporate</div>\n                 </div>\n              </div>",
    //   //   "connectorLineColor": {
    //   //   "red": 220,
    //   //   "green": 189,
    //   //   "blue": 207,
    //   //   "alpha": 1
    //   //   },
    //   //   "connectorLineWidth": 5,
    //   //   "dashArray": "",
    //   //   "expanded": false,
    //   //   "directSubordinates": 4,
    //   //   "totalSubordinates": 1515
    //   // }];
      
    //   this.listInit()

    //   //this.data=data
    // });
    this.spinner.show()
    this.service.getProfile().subscribe(resp=>{
      if(resp.success){
        this.list(resp.data_usuario.persona)
      }
    })
  }

  list(id){
    d3.json(
      //"http://127.0.0.1:8000/api/au/recursive/data-arbol/"+id
      "https://api.jatunayllu.com/api/au/recursive/data-arbol/"+id
      //"https://gist.githubusercontent.com/bumbeishvili/dc0d47bc95ef359fdc75b63cd65edaf2/raw/c33a3a1ef4ba927e3e92b81600c8c6ada345c64b/orgChart.json"
    ).then(data => {
      let new_data:any=[]
      data.data.forEach(i=>{
        let padre_id=i.padre_id, color=''
        if(i.nivel==0){padre_id=null}
        if(i.cantidad_ventas_mes_actual==0){color='#f31f1f'}
        if(i.cantidad_ventas_mes_actual>=4){color='#77dd77'}
        if(i.cantidad_ventas_mes_actual>0&&i.cantidad_ventas_mes_actual<4){color='#ffd700'}
        new_data.push({
          "nodeId": i.hijo_id,
          "parentNodeId": i.padre_id,
          "color": color,
          "width": 400,
          "height": 200,
          "borderWidth": 1,
          "borderRadius": 5,
          "img": i.imagen,
          "directSubordinates": 4,
          "totalSubordinates": 1515,
          "nombre": i.nombre.toUpperCase(),
          "apellido": i.apellido.toUpperCase(),
          "telefono": i.telefono,
          "email": i.email,
          "dni": i.dni,
        })
      })
      this.data = new_data
      this.spinner.hide()
    });
  }

  listInit(){
    this.service.listRed(1).subscribe(resp=>{
      if(resp.success){
        let new_data:any=[]
        resp.data.forEach(i=>{
          let padre_id=i.padre_id
          if(i.nivel==0){padre_id=null}
          new_data.push({
            "nodeId": i.hijo_id,
            "parentNodeId": padre_id,
            "width": 342,
            "height": 146,
            "borderWidth": 1,
            "borderRadius": 5,
            "borderColor": {
              "red": 15,
              "green": 140,
              "blue": 121,
              "alpha": 1
            },
            "backgroundColor": {
              "red": 51,
              "green": 182,
              "blue": 208,
              "alpha": 1
            },
            "nodeImage": {
              "url": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/cto.jpg",
              "width": 100,
              "height": 100,
              "centerTopDistance": 0,
              "centerLeftDistance": 0,
              "cornerShape": "CIRCLE",
              "shadow": false,
              "borderWidth": 0,
              "borderColor": {
              "red": 19,
              "green": 123,
              "blue": 128,
              "alpha": 1
            }
            },
            "nodeIcon": {
              "icon": "https://to.ly/1yZnX",
              "size": 30
            },
            "template": "<div>\n<div style=\"margin-left:70px;\nmargin-top:10px;\nfont-size:20px;\nfont-weight:bold;\n\">Ian Devling </div>\n                 <div style=\"margin-left:70px;\n                              margin-top:3px;\n                              font-size:16px;\n                         \">Cheaf Executive Officer  </div>\n\n                 <div style=\"margin-left:70px;\n                              margin-top:3px;\n                              font-size:14px;\n                         \">Business first</div>\n\n                 <div style=\"margin-left:196px;\n                             margin-top:15px;\n                             font-size:13px;\n                             position:absolute;\n                             bottom:5px;\n                            \">\n                      <div>CTO office</div>\n                      <div style=\"margin-top:5px\">Corporate</div>\n                 </div>\n              </div>",
            "connectorLineColor": {
              "red": 220,
              "green": 189,
              "blue": 207,
              "alpha": 1
            },
            "connectorLineWidth": 5,
            "dashArray": "",
            "expanded": false,
            "directSubordinates": 4,
            "totalSubordinates": 1515,
            "node__data":{
              "nombre": i.nombre,
              "apellido": i.apellido,
              "telefono": i.telefono,
              "email": i.email,
            }
          })
        })
        console.log(new_data)
        this.data = new_data
      }
    })
  }
}