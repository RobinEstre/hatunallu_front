import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  constructor() { }
  
  //Sidebar Notification
  private emitSidebarNofitSource = new Subject<any>();
  SidebarNotifyChangeEmitted = this.emitSidebarNofitSource.asObservable();
  emitSidebarNotifyChange(change: any){
    this.emitSidebarNofitSource.next(change);
  }

  //Switcher
  private emitSwitcherSource = new Subject<any>();
  SwitcherChangeEmitted = this.emitSwitcherSource.asObservable();
  emitSwitcherChange(change: any){
    this.emitSwitcherSource.next(change);
  }
}
