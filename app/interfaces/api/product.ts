import { CreateInfo, UpdateInfo } from "./common"

export interface GetProduct {
    id: string
    seller_id: string
    seller_code: string
    seller_name: string
    product_code: string
    product_name: string
    wholesale_price: number
    cash_price: number
    accruals_price: number
    create_info: CreateInfo
    update_info: UpdateInfo
}
export type GetProductList = GetProduct[];

export interface GetProductDropDown {
    label: string
    value: string
}
export type GetProductDropDownList = GetProductDropDown[];


export interface UpdateProduct {
    seller_id: string
    product_code: string
    product_name: string
    wholesale_price: number
    cash_price: number
    accruals_price: number
}

export const defaultUpdateProduct: UpdateProduct = {
    seller_id: "",
    product_code: "",
    product_name: "",
    wholesale_price: 0,
    cash_price: 0,
    accruals_price: 0,
};

export type GetProductKeys = keyof GetProduct;