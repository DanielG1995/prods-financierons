import { Product } from "./IProduct"

export interface Header {
    label: string,
    key: keyof Product ,
    type?: 'img' | 'text' | 'date' | 'options'
}
