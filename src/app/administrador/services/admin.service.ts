import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlEnviromentService } from 'src/app/shared/services/url-enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  listClientes(estado){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/listar/referidos-todos/?estado='+estado, );
  }
  listEstados(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/listar/estados-pago/', );
  }
  aceptarReferidos(data){
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'au/referidos/aprobar-rechazar/',data );
  }
}
