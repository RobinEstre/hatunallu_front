import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-orden-venta',
  templateUrl: './orden-venta.component.html',
  styleUrls: ['./orden-venta.component.scss']
})
export class OrdenVentaComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  formOrden = this.fb.group({
    tipo_doc: [null, Validators.required],
    condicion: [null, Validators.required],
    departamento: [null, Validators.required],
    provincia: [null, Validators.required],
    distrito: [null, Validators.required],

    nombres: ['', Validators.required],
    num_doc: ['', Validators.required],
    direccion: ['', Validators.required]
  })

  tipo_doc:any=[
    {
      name:'DNI'
    },
    {
      name:'RUC'
    }
  ]
  condicion:any
  departamento:any
  provincia:any
  distrito:any
  dynamicArray:any = [];
  newDynamic:any;

  ngOnInit(): void {
    this.addRow()
  }

  generar(){

  }

  addRow() {
    this.dynamicArray.push({ producto: '', cantidad: '', unit: '', total:'' });
  }

  deleteRow(index) {
    this.dynamicArray.splice(index, 1);
  }

  getValues() {
    console.log(this.dynamicArray);
  }
}
