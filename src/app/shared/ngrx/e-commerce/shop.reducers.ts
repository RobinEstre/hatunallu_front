import { createReducer, on } from "@ngrx/store"
import { addShopData, deleteShopData } from "./shop.action"

export interface DataState {
    data: ReadonlyArray<any>
}

const initialSate = [{
    Quantity: 1,
    id: "1",
    name: "Candy Pure Rose Water",
    offer_price: 6599,
    photo: "./assets/images/pngs/9.jpg",
    price: 1799
}]

export const dataReaducer = createReducer(
    initialSate,
    on(addShopData, (state, {data}) => {
        console.log("Form Add")
        return [...state,data[0]]
    }),
    on(deleteShopData, (state, {id}) =>{
        const updatedPosts = state.filter(post =>{
            return post.id !== id
        })
        return state=updatedPosts
    })
)