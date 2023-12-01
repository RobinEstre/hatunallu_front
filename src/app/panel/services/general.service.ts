import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalhostKeys } from "../enum/localhost-keys";
import { BehaviorSubject } from 'rxjs';
import { UrlEnviromentService } from 'src/app/shared/services/url-enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  data_pack={
    "id": null,
    "name": null,
    "total_price": null,
    "is_active": null,
    "datatable": {
        "draw": 1,
        "columns": [
          {
              "data": "codigoSeguimiento",
              "name": "",
              "searchable": true,
              "orderable": false,
              "search": {
              "value": "",
              "regex": false
              }
          },
        ],
        "order": [
        {
            "column": 3,
            "dir": "desc"
        }
        ],
        "start": 0,
        "length": 10,
        "search": {
        "value": "",
        "regex": false
        }
    }
  }
  userName: string = '';
  userImg: string = '';
  
  public miVariable$ = new BehaviorSubject<boolean>(false);

  setUserName(userName: string) {
    this.userName = userName;
    localStorage.setItem(LocalhostKeys.USERNAME, userName);
  }

  setUserImg(userImg: string) {
    this.userImg = userImg;
    localStorage.setItem(LocalhostKeys.IMG_USER, userImg);
  }

  listGrupos(){
    return this.httpClient.get(this.envUrl.urlAddress + 'au/listar-grupos/', );
  }
  getBancos(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/listar/bancos/');
  }
  getDni(dni){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'consultar-dni-ruc/?type=dni&num_doc='+dni);
  }
  getProfile(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/listar/datos-user/');
  }
  validateCodeURL(data){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'red/validate/link-referido/?code_url='+ data);
  }
  getPacks(){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'red/data-table-packs/', this.data_pack);
  }
  getQr(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'red/codigo-qr');
  }
  registerQr(data=''){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'red/codigo-qr/',data);
  }
  registerClient(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'au/create/registro-referido/',data);
  }
  registerClientLink(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'red/link-referido/',data);
  }
  subirIMG(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'au/subir/archivo-s3/?type=jpeg',data);
  }
  updateIMG(data){
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'au/actualizar/img-perfil/',data);
  }
  updatePassword(data){
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'au/change/password-user/',data);
  }
}