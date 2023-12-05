import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-reconsumo',
  templateUrl: './reconsumo.component.html',
  styleUrls: ['./reconsumo.component.scss']
})
export class ReconsumoComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService,private service: GeneralService) { }

  productos:any; banco:any

  ngOnInit(): void {
    this.list()
  }

  list(){
    this.spinner.show();
    this.service.getProductos().subscribe(resp=>{
      if(resp.success){
        this.productos=resp.data
        this.spinner.hide();
      }
    })
    this.service.getBancos().subscribe(resp=>{
      if(resp.success){
        this.banco=resp.data
      }
    })
  }
}
