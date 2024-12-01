import { Product } from "./IProduct";

export interface Response {
    message: string,
    data: Product[] | Product,
    type: 'success' | 'error',
    pagination?: Pagination
}

export interface Pagination { page: number, total: number, totalPages: number, items: number, q: string, totaCurrentItems:number }

export interface Error {
    error: string
}