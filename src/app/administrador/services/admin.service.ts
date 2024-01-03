import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlEnviromentService } from 'src/app/shared/services/url-enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getListReferidos(params){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/listar/referidos-todos/'+params);
  }
  getHistoryReconsumo(params){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'red/reconsumo-productos/'+params);
  }
  getHistoryMes(params){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'red/listar/reconsumos-admin-fechas/?'+params);
  }
  getNumberAfiliados(inicio, fin){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'red/reconsumo-productos/?cantidad=10&pagina=1&tipo_venta_id=1&fecha_inicio='+inicio+'&fecha_fin='+fin);
  }
  listClientes(estado){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/listar/referidos-todos/?estado='+estado);
  }
  listEstados(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/listar/estados-pago/');
  }
  aceptarReferidos(data){
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'au/referidos/aprobar-rechazar/',data);
  }
  validateEntrega(id, data){
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'red/reconsumo-productos/'+id+'/',data);
  }
  listReferidos(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'red/listar/patrocinador-referidos/');
  }
  listPersona(id){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'red/listar/personas/?id_persona='+id);
  }
  changePadre(data){
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'red/traslado/referido/',data);
  }
}
