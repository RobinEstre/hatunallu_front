import { createAction, props } from "@ngrx/store";
import { ShopDataState } from "src/app/components/e-commerce/shop/shop.component";

export const getShopData = createAction('[ShopData] Get data')
export const addShopData = createAction('[ShopData] Add data', (data:any) => data)
export const deleteShopData = createAction('[ShopData] Add movie data', props<{id:any}>())