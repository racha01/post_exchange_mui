import { CreateInfo, UpdateInfo } from "./common"

export interface GetDeliverGoods {
    id: string
    seller_code: string
    seller_name: string
    product_id: string
    product_code: string
    product_name: string
    wholesale_price: number
    cash_price: number
    accruals_price: number
    amount: number
    leftovers: number
    deliver_good_date: string
    create_info: CreateInfo;
    update_info: UpdateInfo;
}
export interface DeliverGoodQueryParam {
    sellerId?: string
    startDate?: string | null
    endDate?: string  | null
    pageNo?: number
    pageSize?: number
}


export const defaultDeliverGoods: GetDeliverGoods = {
    id: "",
    seller_code: "",
    seller_name: "",
    product_id: "",
    product_code: "",
    product_name: "",
    wholesale_price: 0,
    cash_price: 0,
    accruals_price: 0,
    amount: 0,
    leftovers: 0,
    deliver_good_date: "",
    create_info: {
        timestamp: "",
        user_id: "",
        user_name: "",
    },
    update_info: {
        timestamp: "",
        user_id: "",
        user_name: "",
    },
}


export interface UpdateDeliverGoods {
    product_id: string
    wholesale_price: number
    cash_price: number
    accruals_price: number
    amount: number
    leftovers: number
    deliver_good_date: string
}

export type GetDeliverGoodsList = GetDeliverGoods[];


