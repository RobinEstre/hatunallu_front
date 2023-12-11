import {Component, Input, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-buttons-table-reconsumo-almacen',
  templateUrl: './buttons-table-reconsumo-almacen.component.html',
  styleUrls: ['./buttons-table-reconsumo-almacen.component.scss']
})
export class ButtonsTableReconsumoAlmacenComponent implements OnInit {
  @Output() emitter = new Subject<any>();

  @Input() actions!: Array<any>;
  @Input() data:any;

  new_data:any=[]

  constructor() { }

  ngOnInit(): void {
    let estado=this.data.estado.name
    this.actions.forEach(i=>{
      let mostrar=false
      if(i.estado=='TODOS'){
        mostrar=true
      }else if(i.estado==estado){
        mostrar=true
      }
      this.new_data.push({
        cmd: i.cmd,
        label: i.label,
        classList: i.classList,
        mostrar: mostrar,
        icon: i.icon,
      })
    })
  }

  onActionClick(cmd: string): void {
    this.emitter.next({
      cmd: cmd,
      data: this.data
    });
  }

  onEditClick(): void {
    this.emitter.next({
      cmd: 'edit',
      data: this.data
    });
  }

  onDeleteClick(): void {
    this.emitter.next({
      cmd: 'delete',
      data: this.data
    });
  }

  ngOnDestroy(): void {
    this.emitter.unsubscribe();
  }
}