import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthServiceService } from 'src/app/authentication/services/auth-service.service';

@Component({
  selector: 'app-referidos',
  templateUrl: './referidos.component.html',
  styleUrls: ['./referidos.component.scss']
})
export class ReferidosComponent implements OnInit {

  constructor(private fb: FormBuilder,private spinner: NgxSpinnerService,private authservice: AuthServiceService) { }

  loginForm = this.fb.group({
    nombres : ['',Validators.required],
    apellidos : ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    celular : ['', Validators.required],
    pais : [null],
    prefijo : [null],
  });

  pais:any=[]; prefijo:any=[]

  ngOnInit(): void {
    this.list()
  }

  list(){
    this.spinner.show();
    this.authservice.listCountry().subscribe(data => {
      let dato:any=[], pref:any=[], id
      console.log(data)
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
      this.spinner.hide();
    })
  }

  selectPais(event){
    this.prefijo.forEach(i=>{
      if(i.id==event.id){
        this.loginForm.controls.prefijo.setValue(i.id)
      }
    })
  }

  sendData(){}
}
