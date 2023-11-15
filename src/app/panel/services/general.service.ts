import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
        {
            "data": "metodoEnvio",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "pesoVolumetrico",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "estadoZeus",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "flota",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "fechaRegistro",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "placaRecepcion",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "puertaRecepcion",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "responsableRecepcion",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "tipoRecepcion",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "negocio",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "nombreSeller",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "bultosRecepcionados",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "descripcionProducto",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "estadoRecepcio",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "estadoSistemico",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "fechaCierre",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "fechaInicio",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        },
        {
            "data": "vueltaRecepcion",
            "name": "",
            "searchable": true,
            "orderable": false,
            "search": {
            "value": "",
            "regex": false
            }
        }
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
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'red/cliente/',data);
  }
  subirIMG(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'au/subir/archivo-s3/?type=jpeg',data);
  }
  updateIMG(data){
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'au/actualizar/img-perfil/',data);
  }
}