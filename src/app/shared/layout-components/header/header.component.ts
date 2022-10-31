import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';/*
import { deleteShopData } from '../../ngrx/e-commerce/shop.action';
import { ShopService } from '../../services/e-commerce/shop.service';*/
import { LayoutService } from '../../services/layout.service';
import { Menu, NavService } from '../../services/nav.service';
import { SwitcherService } from '../../services/switcher.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isCollapsed = true;


  constructor(
    private layoutService: LayoutService,
    public navServices: NavService,
    private modalService: NgbModal,
    public SwitcherService : SwitcherService,
    private router: Router,
    //public ShopService: ShopService,
    private store: Store<any>
  ){
    this.price();
  }


  data$ = this.store.select('data')
  totalMoney:any = 0
  totalLength = 1
  delectFunction = false
  getdelectData:any
  price(){
    this.data$.forEach((item) =>{

      this.totalLength = item.length
      if(item.length>1){

        this.totalMoney =this.totalMoney+item[this.totalLength-1].offer_price
      }
      else{
        this.totalMoney = item[0].offer_price
      }
      if(this.delectFunction){
        this.totalMoney = 0
        this.delectFunction = false
      }
    })
  }

  /*delect(id:any){
    if(confirm('Are you sure you want to delete this item?')){
      this.delectFunction = true
      //this.store.dispatch(deleteShopData({id}))
      let delectOutData
      this.data$.forEach((item) =>{
        delectOutData = item
      })
      //this.getdelectData = delectOutData.filter(x =>{
        return id != x.id
      })
      this.totalMoney = 0;
      for (let i of this.getdelectData){
        this.totalMoney = this.totalMoney + i.offer_price
      }
    }
  }*/



  ngOnInit(): void {
    this.navServices.items.subscribe((menuItems) => {
      this.items = menuItems;
    });
    // To clear and close the search field by clicking on body
    document.querySelector('.main-content')?.addEventListener('click',()=>{
      this.clearSearch();
    })
    this.text = '';
  }


/*  toggleSidebar(){
    if ((this.navServices.collapseSidebar = true)) {
      document.querySelector("body")?.classList.toggle("sidenav-toggled")
    }
    console.log("from header" + " " ,this.ShopService.retunData())
  }*/

  open(content:any) {
    this.modalService.open(content, {backdrop : 'static' , windowClass : 'modalCusSty', size: 'lg' })
  }

  toggleSwitcher() {
    this.SwitcherService.emitChange(true);
    document.querySelector('body')?.classList.remove("sidenav-toggled-open")
  }

  toggleSidebarNotification() {
    this.layoutService.emitSidebarNotifyChange(true);
  }

  signout() {
    // this.auth.SignOut();
    this.router.navigate(['/auth/login']);
  }


  // Search
  public menuItems!: Menu[];
    public items!: Menu[];
    public text!: string;
    public SearchResultEmpty:boolean = false;



  Search(searchText: any) {
    if (!searchText) return this.menuItems = [];
    // items array which stores the elements
    let items:any[] = [];
    // Converting the text to lower case by using toLowerCase() and trim() used to remove the spaces from starting and ending
    searchText = searchText.toLowerCase().trim();
    this.items.filter((menuItems:any) => {
      // checking whether menuItems having title property, if there was no title property it will return
      if (!menuItems?.title) return false;
      //  checking wheteher menuitems type is text or string and checking the titles of menuitems
      if (menuItems.type === 'link' && menuItems.title.toLowerCase().includes(searchText)) {
        // Converting the menuitems title to lowercase and checking whether title is starting with same text of searchText
        if( menuItems.title.toLowerCase().startsWith(searchText)){// If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(menuItems))
          // If both are matching then the code is pushed to items array
          items.push(menuItems);
        }
      }
      //  checking whether the menuItems having children property or not if there was no children the return
      if (!menuItems.children) return false;
      menuItems.children.filter((subItems:any) => {
        if (subItems.type === 'link' && subItems.title.toLowerCase().includes(searchText)) {
          if( subItems.title.toLowerCase().startsWith(searchText)){         // If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(subItems))
            items.push(subItems);
          }

        }
        if (!subItems.children) return false;
        subItems.children.filter((subSubItems:any) => {
          if (subSubItems.title.toLowerCase().includes(searchText)) {
            if( subSubItems.title.toLowerCase().startsWith(searchText)){// If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(subSubItems))
              items.push(subSubItems);
            }
          }
        })
        return;
      })
      return this.menuItems = items;
    });
    // Used to show the No search result found box if the length of the items is 0
    if(!items.length){
      this.SearchResultEmpty = true;
    }
    else{
      this.SearchResultEmpty = false;
    }
    return;
  }

   //  Used to clear previous search result
   clearSearch() {
    this.text = '';
    this.menuItems = [];
    this.SearchResultEmpty = false;
    return this.text, this.menuItems
  }


}
