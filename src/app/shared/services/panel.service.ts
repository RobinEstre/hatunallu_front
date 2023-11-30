import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UrlEnviromentService} from "../../shared/services/url-enviroment.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PanelService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  public _show = new BehaviorSubject<boolean>(false);
  public quantityShow = this._show.asObservable();

  public _empresa = new BehaviorSubject<boolean>(true);
  public ShowEmpresaObs = this._empresa.asObservable();

  sendShow(menu: any) {
    this._show.next(menu);
    //console.log(this._show)
  }

  sendEmpresaHeader(status: any){
    this._show.next(status);
  }

  lisEmpresas(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/listar-empresas/', );
  }
}
