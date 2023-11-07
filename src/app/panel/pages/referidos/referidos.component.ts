import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthServiceService } from 'src/app/authentication/services/auth-service.service';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-referidos',
  templateUrl: './referidos.component.html',
  styleUrls: ['./referidos.component.scss']
})
export class ReferidosComponent implements OnInit {

  constructor(private fb: FormBuilder,private spinner: NgxSpinnerService,private authservice: AuthServiceService,
    private service: GeneralService) { }

  formRegister = this.fb.group({
    nombres : ['',Validators.required],
    apellidos : ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    celular : ['', Validators.required],
    monto : ['', Validators.required],
    pais : [null],
    prefijo : [null],
  });

  pais:any=[]; prefijo:any=[]; packs:any

  ngOnInit(): void {
    this.listCountries()
  }

  listCountries(){
    this.spinner.show();
    this.authservice.listCountry().subscribe(data => {
      let dato:any=[], pref:any=[], id
      data.forEach(i=>{
        dato.push({
          name: i.name.common,
          id: i.fifa
        })
      })
      data.forEach(i=>{
        if(Array.isArray(i.idd.suffixes)){
          id=i.idd.suffixes[0]
        }else{id=i.idd.suffixes}
        dato.push({
          name: i.name.common,
          id: i.fifa
        })
        pref.push({
          name: i.idd.root+id,
          id: i.fifa
        })
      })
      this.prefijo=pref
      this.pais=dato
      this.listInit()
    })
  }

  listInit(){
    this.service.getPacks().subscribe(resp=>{
      if(resp.success){
        this.packs=resp.data
        this.spinner.hide();
      }
    })
  }

  selectPais(event){
    this.prefijo.forEach(i=>{
      if(i.id==event.id){
        this.formRegister.controls.prefijo.setValue(i.id)
      }
    })
  }

  getPack(event){
    const value = +event.target.value;
    if(value<1){this.formRegister.controls.monto.setValue('')}
    if(1<=value && value<=51){}
    if(51<=value && value<=499){}
    if(500<=value && value<=2000){}
    console.log(value)
  }

  sendData(){}
}
