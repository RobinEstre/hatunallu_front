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
  listEstados(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/listar/estados-pago/', );
  }
  getHistoryReconsumo(params){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'red/reconsumo-productos/'+params);
  }
  getComisionesReconsumo(data){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/listar/data-reconsumo-comision/'+data.id+'?fecha_inicio='+data.inicio+'&fecha_fin='+data.fin);
  }
  getProductos(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'red/productos/');
  }
  getBancos(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/listar/bancos/');
  }
  getComisiones(id){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/listar/referidos-comision/'+id);
  }
  getComisiones2(id, params){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/listar/referidos-comision/'+id+'?'+params);
  }
  getDni(dni){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'consultar-dni-ruc/?type=dni&num_doc='+dni);
  }
  getProfile(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/listar/datos-user/');
  }
  getHistoryPagosId(id, mes, ano){
    return this.httpClient.get<any>(this.envUrl.urlAddress + `red/listar/pago-afiliado/${id}?num_month=${mes}&num_year=${ano}`);
  }
  getRango(id){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/listar/puntos-rango/'+id);
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
  registerReconsumo(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'red/reconsumo-productos/',data);
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
  listDepartamento() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'departamentos/listar-departamentos', );
  }
  listProvincia(id) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'provincias/listar-provincias/'+id, );
  }
  listDistrito(id) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'distritos/listar-distritos/'+id,);
  }
  listRed(id) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/recursive/data-arbol/'+id,);
  }
}