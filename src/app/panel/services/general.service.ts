import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlEnviromentService } from 'src/app/shared/services/url-enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getProfile(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'au/listar/datos-user/');
  }
}